import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CameraView as ExpoCameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, SwitchCamera, X, Check } from 'lucide-react-native';
import { Colors, spacing, borderRadius, typography } from '../../constants';
import { Button } from '../ui/Button';

export interface CameraViewProps {
  onCapture: (uri: string) => void;
  onClose: () => void;
  mode?: 'photo' | 'video';
}

export function CameraView({ onCapture, onClose, mode = 'photo' }: CameraViewProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const cameraRef = useRef<ExpoCameraView>(null);

  // Verificar permisos
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Cargando cámara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          MiLegado necesita acceso a la cámara para capturar fotos y videos.
        </Text>
        <Button
          title="Permitir acceso"
          onPress={requestPermission}
          style={styles.permissionButton}
        />
        <Button
          title="Cancelar"
          onPress={onClose}
          variant="ghost"
          style={styles.cancelButton}
        />
      </View>
    );
  }

  // Cambiar cámara frontal/trasera
  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  // Tomar foto
  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });
      if (photo) {
        setCapturedUri(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  // Grabar video
  const startRecording = async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync({
        maxDuration: 60,
      });
      if (video) {
        setCapturedUri(video.uri);
      }
      setIsRecording(false);
    } catch (error) {
      console.error('Error recording video:', error);
      setIsRecording(false);
    }
  };

  // Detener grabación
  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  // Confirmar captura
  const confirmCapture = () => {
    if (capturedUri) {
      onCapture(capturedUri);
    }
  };

  // Descartar captura
  const discardCapture = () => {
    setCapturedUri(null);
  };

  // Si hay una captura, mostrar vista previa
  if (capturedUri) {
    return (
      <View style={styles.container}>
        <View style={styles.previewHeader}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={discardCapture}
          >
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.previewTitle}>Vista previa</Text>
          <TouchableOpacity
            style={[styles.headerButton, styles.confirmButton]}
            onPress={confirmCapture}
          >
            <Check size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.previewContainer}>
          {/* Aquí se mostraría la imagen o video capturado */}
          <Text style={styles.message}>
            {mode === 'photo' ? 'Foto capturada' : 'Video grabado'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoCameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode={mode === 'video' ? 'video' : 'picture'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={onClose}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Controles */}
        <View style={styles.controls}>
          {/* Espacio izquierdo */}
          <View style={styles.controlSpace} />

          {/* Botón de captura */}
          <TouchableOpacity
            style={[
              styles.captureButton,
              isRecording && styles.captureButtonRecording,
            ]}
            onPress={mode === 'photo' ? takePicture : isRecording ? stopRecording : startRecording}
          >
            {mode === 'video' && isRecording ? (
              <View style={styles.stopIcon} />
            ) : (
              <Camera size={32} color={isRecording ? Colors.error : Colors.text} />
            )}
          </TouchableOpacity>

          {/* Botón de cambiar cámara */}
          <TouchableOpacity
            style={styles.switchButton}
            onPress={toggleCameraFacing}
          >
            <SwitchCamera size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </ExpoCameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  camera: {
    flex: 1,
  },
  message: {
    ...typography.body,
    color: Colors.text,
    textAlign: 'center',
    padding: spacing.xl,
  },
  permissionButton: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  cancelButton: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  controlSpace: {
    width: 48,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.text,
  },
  captureButtonRecording: {
    backgroundColor: Colors.error,
  },
  stopIcon: {
    width: 24,
    height: 24,
    backgroundColor: Colors.text,
    borderRadius: 4,
  },
  switchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  previewTitle: {
    ...typography.h3,
    color: Colors.text,
  },
  confirmButton: {
    backgroundColor: Colors.success,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraView;
