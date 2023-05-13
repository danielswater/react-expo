import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

import * as ImagePicker from 'expo-image-picker'

import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library'
import { captureRef } from 'react-native-view-shot';

import { useState, useRef } from 'react';

const PlaceholderImage = require('./assets/images/background-image.png')

export default function App() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const [showAppOptions, setShowAppOptions] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [pickEmoji, setPickEmoji] = useState(null)
    const [status, requestPermission] = MediaLibrary.usePermissions()
    const imageRef = useRef<View>(null)

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1
        })
        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri)
            setShowAppOptions(true)
        }
        else {
            alert('Você não selecionou uma imagem')
        }
    }

    const onReset = () => {
        setShowAppOptions(false)
    }

    const onAddSticker = () => {
        setIsModalVisible(true)
    }

    const onModalClose = () => {
        setIsModalVisible(false)
    }

    const onSaveImageAsync = async () => {
        try {
            const localUri = await captureRef(imageRef, {
                height: 400,
                quality: 1
            });

            await MediaLibrary.saveToLibraryAsync(localUri);
            if (localUri) {
                alert('Salvo')
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    if (status === null) {
        requestPermission()
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.imageContainer}>
                <View ref={imageRef} collapsable={false}>
                    <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
                    {pickEmoji !== null ? <EmojiSticker imageSize={40} stickerSource={pickEmoji} /> : null}
                </View>
            </View>
            {showAppOptions ? (
                <View style={styles.optionsContainer}>
                    <View style={styles.optionsRow}>
                        <IconButton icon="refresh" label="Voltar" onPress={onReset} />
                        <CircleButton onPress={onAddSticker} />
                        <IconButton icon="save-alt" label="Salvar" onPress={onSaveImageAsync} />
                    </View>
                </View>) : (
                <View>
                    <Button theme="primary" label="Escoha uma foto" onPress={pickImageAsync} />
                    <Button label="Usar essa foto" onPress={() => setShowAppOptions(true)} />
                </View>
            )}

            <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
                <EmojiList onSelect={setPickEmoji} onCloseModal={onModalClose} />
            </EmojiPicker>

            <StatusBar style="light" />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1,
        paddingTop: 58,
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: 'center'
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 80,
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },

});
