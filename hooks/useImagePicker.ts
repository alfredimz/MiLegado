import * as ImagePicker from 'expo-image-picker';

export interface MediaAsset {
    uri: string;
    type: 'image' | 'video';
    width: number;
    height: number;
    base64?: string | null;
}

export function useImagePicker() {
    const pickImage = async (): Promise<MediaAsset | null> => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.4, // Compresión agresiva para Base64
            base64: true,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            return {
                uri: asset.uri,
                type: 'image',
                width: asset.width,
                height: asset.height,
                base64: asset.base64,
            };
        }
        return null;
    };

    const takePhoto = async (): Promise<MediaAsset | null> => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.4, // Compresión agresiva para Base64
            base64: true,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            return {
                uri: asset.uri,
                type: 'image',
                width: asset.width,
                height: asset.height,
                base64: asset.base64,
            };
        }
        return null;
    };

    return { pickImage, takePhoto };
}
