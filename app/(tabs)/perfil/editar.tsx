import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Save } from 'lucide-react-native';
import { Colors, spacing, typography, borderRadius } from '../../../constants';
import { Button, Input, Avatar } from '../../../components/ui';
import { Header } from '../../../components/layout';
import { useAuth } from '../../../contexts/AuthContext';
import { useImagePicker } from '../../../hooks';
import { uploadUserAvatar } from '../../../services/storage';

export default function EditarPerfilScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user, updateUser } = useAuth();
    const { pickImage, takePhoto } = useImagePicker();

    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageBase64, setSelectedImageBase64] = useState<string | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);

    // Procesar resultado de imagen
    const processImageResult = (result: any) => {
        if (result) {
            setSelectedImage(result.uri);
            setSelectedImageBase64(result.base64 || undefined);
        }
    };

    // Seleccionar imagen
    const handleSelectImage = async () => {
        const result = await takePhoto();
        processImageResult(result);
        // Alert.alert(
        //     'Cambiar foto',
        //     '¿De dónde quieres tomar la imagen?',
        //     [
        //         {
        //             text: 'Cancelar',
        //             style: 'cancel',
        //         },
        //         {
        //             text: 'Cámara',
        //             onPress: async () => {
        //                 try {
        //                     const result = await takePhoto();
        //                     processImageResult(result);
        //                 } catch (error) {
        //                     console.error('Error cámara:', error);
        //                     Alert.alert('Error', 'No se pudo abrir la cámara');
        //                 }
        //             },
        //         },
        //         {
        //             text: 'Galería',
        //             onPress: async () => {
        //                 try {
        //                     const result = await pickImage();
        //                     processImageResult(result);
        //                 } catch (error) {
        //                     console.error('Error galería:', error);
        //                     Alert.alert('Error', 'No se pudo abrir la galería');
        //                 }
        //             },
        //         },
        //     ]
        // );
    };

    const handleSave = async () => {
        if (!user) return;

        if (!displayName.trim()) {
            Alert.alert('Error', 'El nombre no puede estar vacío');
            return;
        }

        setIsSaving(true);
        try {
            let photoURL = user.photoURL;

            // 1. Si hay nueva imagen, usar el Base64
            console.log("Selected Image Base64 length:", selectedImageBase64?.length);
            console.log("Selected Image Base64 start:", selectedImageBase64?.substring(0, 50));

            if (selectedImageBase64) {
                // Pasamos el base64 directamente. Nota: uploadUserAvatar espera (id, uri, onProgress).
                // Pero vamos a cambiar uploadUserAvatar para que acepte base64 string como segundo argumento si detecta que es base64,
                // O mejor aun, pasamos el base64 string como el "uri" y el servicio lo manejara.
                // Para ser explicitos, formaremos el data URI aquí o en el servicio.
                // Vamos a pasar el base64 raw y el servicio lo formateará.
                photoURL = await uploadUserAvatar(user.uid, selectedImageBase64);
            } else if (selectedImage && !selectedImageBase64) {
                // Fallback por si acaso no llego base64 (no debería pasar con la config actual)
                Alert.alert("Error", "No se pudo procesar la imagen (falta base64)");
                return;
            }

            // 2. Actualizar perfil de usuario
            await updateUser({
                displayName: displayName.trim(),
                photoURL: photoURL,
            });

            Alert.alert('Éxito', 'Perfil actualizado correctamente', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Error al actualizar perfil:', error);
            Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Header title="Editar Perfil" showBack />

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}>

                {/* Avatar Editor */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <Avatar
                            source={selectedImage || user?.photoURL}
                            name={displayName || user?.displayName}
                            size="xl"
                        />
                        <TouchableOpacity
                            style={styles.cameraButton}
                            onPress={handleSelectImage}
                            activeOpacity={0.8}
                        >
                            <Camera size={20} color={Colors.textInverse} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.changePhotoText}>Toca para cambiar foto</Text>
                </View>

                {/* Formulario */}
                <View style={styles.form}>
                    <Input
                        label="Nombre completo"
                        value={displayName}
                        onChangeText={setDisplayName}
                        placeholder="Tu nombre"
                        autoCapitalize="words"
                    />

                    <Input
                        label="Correo electrónico"
                        value={user?.email || ''}
                        editable={false}
                        placeholder="email@ejemplo.com"
                        hint="El correo no se puede cambiar"
                    />
                </View>

            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
                <Button
                    title="Guardar Cambios"
                    onPress={handleSave}
                    loading={isSaving}
                    fullWidth
                    icon={<Save size={20} color={Colors.textInverse} />}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        alignItems: 'center',
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.sm,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.background,
    },
    changePhotoText: {
        ...typography.bodySm,
        color: Colors.primary,
        fontWeight: '500',
    },
    form: {
        width: '100%',
        gap: spacing.md,
    },
    footer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        backgroundColor: Colors.background,
    },
});
