import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, spacing } from '../../constants';
import { Button, Avatar } from '../../components/ui';
import { Header } from '../../components/layout';
import { useAuth } from '../../contexts/AuthContext';
import { useStorage } from '../../hooks/useStorage';
import { createCarta, getUserGuardianes, updateCarta } from '../../services/firestore';
import { uploadCartaMedia } from '../../services/storage';
import type { Guardian, CartaDraft, TipoCarta } from '../../types';

export default function AsignarGuardianScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const { saveDraft } = useStorage();

    const params = useLocalSearchParams<{
        id?: string;
        titulo: string;
        tipo: TipoCarta | 'foto';
        contenido: string;
        mediaItems?: string;
    }>();

    const [guardianes, setGuardianes] = useState<Guardian[]>([]);
    const [selectedGuardianes, setSelectedGuardianes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveProgress, setSaveProgress] = useState(0);

    useEffect(() => {
        loadGuardianes();
    }, [user]);

    useEffect(() => {
        if (params.id && !params.id.startsWith('draft_') && guardianes.length > 0) {
        }
    }, [guardianes, params.id]);

    const loadGuardianes = async () => {
        if (!user) return;
        try {
            const data = await getUserGuardianes(user.uid);
            setGuardianes(data);
        } catch (error) {
            console.error('Error cargando guardianes:', error);
            Alert.alert('Error', 'No se pudieron cargar tus guardianes');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleGuardian = (id: string) => {
        setSelectedGuardianes(prev =>
            prev.includes(id)
                ? prev.filter(gId => gId !== id)
                : [...prev, id]
        );
    };

    const handleSaveDraft = async () => {
        try {
            const contenido = JSON.parse(params.contenido || '{}');

            const draftId = params.id && params.id.startsWith('draft_') ? params.id : `draft_${Date.now()}`;
            const mediaItems = params.mediaItems ? JSON.parse(params.mediaItems) : undefined;

            const draftContenido = { ...contenido };
            if (mediaItems && mediaItems.length > 0) {
            }

            const draftTipo = params.tipo === 'foto' ? 'mixta' : params.tipo;

            const draft: CartaDraft = {
                id: draftId,
                titulo: params.titulo || 'Sin título',
                tipo: draftTipo,
                contenido: draftContenido,
                guardianes: selectedGuardianes,
                lastModified: new Date().toISOString(),
            };

            await saveDraft(draft);
            Alert.alert('Borrador Guardado', 'Puedes continuar editándolo desde "Mis Cartas".', [
                { text: 'OK', onPress: () => router.replace('/(tabs)/cartas') }
            ]);
        } catch (error) {
            console.error("Error guardando borrador:", error);
            Alert.alert("Error", "No se pudo guardar el borrador.");
        }
    };

    const handleFinalize = async () => {
        if (!user) return;

        if (selectedGuardianes.length === 0) {
            Alert.alert("Faltan Guardianes", "Debes seleccionar al menos un guardián para finalizar la carta. Si no estás listo, guárdala como borrador.");
            return;
        }

        setIsSaving(true);
        setSaveProgress(10);

        try {
            const contenido = JSON.parse(params.contenido || '{}');
            const mediaItems = params.mediaItems ? JSON.parse(params.mediaItems) : [];
            const cartaTipo = params.tipo === 'foto' ? 'mixta' : params.tipo;

            let cartaId = params.id;
            const isEditingActive = cartaId && !cartaId.startsWith('draft_');

            if (isEditingActive && cartaId) {
                await updateCarta(cartaId, {
                    titulo: params.titulo,
                    contenido: { ...contenido },
                    guardianes: selectedGuardianes,
                    estado: 'activa',
                });
                setSaveProgress(30);

            } else {
                const nuevaCarta = await createCarta(user.uid, {
                    titulo: params.titulo,
                    tipo: cartaTipo,
                    contenido: {
                        texto: contenido.texto,
                    },
                    guardianes: selectedGuardianes,
                    estado: 'activa',
                });
                cartaId = nuevaCarta.id;
                setSaveProgress(30);
            }

            const uploadedUrls: { type: 'image' | 'video' | 'audio', url: string }[] = [];
            const itemsToUpload: any[] = [];

            if (mediaItems.length > 0) {
                mediaItems.forEach((item: any) => {
                    if (item.uri && (item.uri.startsWith('http') || item.uri.startsWith('https'))) {
                        uploadedUrls.push({
                            type: item.type || (params.tipo === 'audio' ? 'audio' : 'image'),
                            url: item.uri
                        });
                    } else {
                        itemsToUpload.push(item);
                    }
                });
            }

            const totalUploads = itemsToUpload.length;
            if (totalUploads > 0) {
                let itemsProcessed = 0;
                for (const item of itemsToUpload) {
                    let mediaType: 'image' | 'video' | 'audio' = 'image';
                    if (params.tipo === 'audio' || item.type === 'audio') mediaType = 'audio';
                    else if (params.tipo === 'video') mediaType = 'video';
                    else if (params.tipo === 'foto') mediaType = 'image';

                    const url = await uploadCartaMedia(user.uid, cartaId!, item.uri, mediaType);
                    uploadedUrls.push({ type: mediaType, url });

                    itemsProcessed++;
                    setSaveProgress(30 + Math.round((itemsProcessed / totalUploads) * 60));
                }
            }

            setSaveProgress(90);

            if (uploadedUrls.length > 0) {
                const audio = uploadedUrls.find(u => u.type === 'audio');
                const video = uploadedUrls.find(u => u.type === 'video');
                const images = uploadedUrls.filter(u => u.type === 'image').map(u => u.url);

                const updatedContenido = { ...contenido };
                if (audio) updatedContenido.audioUrl = audio.url;
                if (video) updatedContenido.videoUrl = video.url;
                if (images.length > 0) updatedContenido.imageUrls = images;

                await updateCarta(cartaId!, {
                    contenido: updatedContenido
                });
            }

            if (params.id && params.id.startsWith('draft_')) {
                await import('../../hooks/useStorage').then(m => {
                });
            }

            setSaveProgress(100);

            Alert.alert(
                '¡Legado Guardado!',
                'Tu carta ha sido actualizada exitosamente.',
                [
                    {
                        text: 'Ir a Mis Cartas',
                        onPress: () => router.replace('/(tabs)/cartas'),
                    }
                ]
            );

        } catch (error: any) {
            console.error("Error guardando carta:", error);
            Alert.alert('Error', error.message || 'Hubo un problema al guardar tu carta.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header title="Asignar Guardianes" showBack />

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}>
                <Text style={styles.title}>¿Quién recibirá este legado?</Text>
                <Text style={styles.subtitle}>
                    Selecciona los guardianes que tendrán acceso a esta carta cuando llegue el momento.
                </Text>

                <TouchableOpacity
                    style={styles.addGuardianButton}
                    onPress={() => router.push('/(tabs)/guardianes/nuevo')}
                >
                    <View style={styles.addIcon}>
                        <Text style={styles.addEmoji}>➕</Text>
                    </View>
                    <Text style={styles.addText}>Agregar nuevo guardián</Text>
                </TouchableOpacity>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingEmoji}>💓</Text>
                        <Text style={styles.loadingText}>Cargando guardianes...</Text>
                    </View>
                ) : (
                    <View style={styles.list}>
                        {guardianes.map(guardian => {
                            const isSelected = selectedGuardianes.includes(guardian.id);
                            return (
                                <TouchableOpacity
                                    key={guardian.id}
                                    style={[styles.card, isSelected && styles.cardSelected]}
                                    onPress={() => toggleGuardian(guardian.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.cardContent}>
                                        <Avatar
                                            source={guardian.photoURL}
                                            name={guardian.nombre}
                                            size="md"
                                        />
                                        <View style={styles.info}>
                                            <Text style={styles.name}>{guardian.nombre}</Text>
                                            <Text style={styles.relation}>{guardian.relacion}</Text>
                                        </View>
                                        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                                            {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                        {guardianes.length === 0 && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>👥</Text>
                                <Text style={styles.emptyText}>No tienes guardianes registrados aún.</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
                <Button
                    title={isSaving ? `Guardando... ${saveProgress}%` : "Finalizar Carta (Activar)"}
                    onPress={handleFinalize}
                    fullWidth
                    loading={isSaving}
                    disabled={isSaving || selectedGuardianes.length === 0}
                />
                <Button
                    title="Guardar como borrador"
                    onPress={handleSaveDraft}
                    variant="ghost"
                    style={styles.ghostButton}
                    disabled={isSaving}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },
    title: {
        fontSize: 24,
        fontFamily: 'CormorantGaramond_300Light',
        fontWeight: '300',
        color: Colors.text,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Nunito_300Light',
        color: Colors.textSecondary,
        marginBottom: spacing.xl,
    },
    addGuardianButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: Colors.surface,
        borderRadius: 0, // Paradise Garden: sin border radius
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        borderStyle: 'dashed',
    },
    addIcon: {
        width: 40,
        height: 40,
        borderRadius: 0, // Paradise Garden: sin border radius
        borderWidth: 1,
        borderColor: Colors.borderLight,
        backgroundColor: Colors.surfaceAlt,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    addEmoji: {
        fontSize: 18,
    },
    addText: {
        fontSize: 16,
        fontFamily: 'Nunito_400Regular',
        color: Colors.primary,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    loadingEmoji: {
        fontSize: 32,
        marginBottom: spacing.sm,
    },
    loadingText: {
        fontSize: 16,
        fontFamily: 'Nunito_300Light',
        color: Colors.textMuted,
        textAlign: 'center',
    },
    list: {
        gap: spacing.md,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 0, // Paradise Garden: sin border radius
        padding: spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardSelected: {
        borderColor: Colors.primary,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        marginLeft: spacing.md,
    },
    name: {
        fontSize: 16,
        fontFamily: 'Nunito_400Regular',
        fontWeight: '400',
        color: Colors.text,
    },
    relation: {
        fontSize: 12,
        fontFamily: 'Nunito_400Regular',
        color: Colors.textSecondary,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 0, // Paradise Garden: sin border radius
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    checkIcon: {
        fontSize: 14,
        color: Colors.textInverse,
    },
    emptyState: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'Nunito_300Light',
        color: Colors.textMuted,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        backgroundColor: Colors.background,
    },
    ghostButton: {
        marginTop: spacing.sm,
    }
});
