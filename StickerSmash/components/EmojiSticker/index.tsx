import { View, Image } from 'react-native'
import { TapGestureHandler, PanGestureHandlerGestureEvent, PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedGestureHandler,
    withSpring
}
    from 'react-native-reanimated'

const AnimatedImage = Animated.createAnimatedComponent(Image)
const AnimatedView = Animated.createAnimatedComponent(View)


interface ISticker {
    imageSize: any,
    stickerSource: any
}

interface IGestureContext {
    [key: string]: any
    translateX: number;
    translateY: number;
}

export default function ({ imageSize, stickerSource }: ISticker) {

    const scaleImage = useSharedValue(imageSize)
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)

    const imageStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(scaleImage.value),
            height: withSpring(scaleImage.value),
        }
    })

    const cointainerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value }
            ]
        }
    })

    const onDrag = useAnimatedGestureHandler<
        PanGestureHandlerGestureEvent,
        IGestureContext
    >({
        onStart: (event, context) => {
            context.translateX = translateX.value;
            context.translateY = translateY.value;
        },
        onActive: (event, context) => {
            translateX.value = event.translationX + context.translateX;
            translateY.value = event.translationY + context.translateY;
        },
    })

    return (
        <PanGestureHandler onGestureEvent={onDrag}>
            <AnimatedView style={[cointainerStyle, { top: -350 }]}>
                <TapGestureHandler
                    onGestureEvent={useAnimatedGestureHandler({
                        onActive: () => {
                            if (scaleImage.value) {
                                scaleImage.value = scaleImage.value * 2;
                            }
                        },
                    })}
                    numberOfTaps={2}
                >
                    <AnimatedImage
                        source={stickerSource}
                        resizeMode='contain'
                        style={[imageStyle, { width: imageSize, height: imageSize }]}
                    />
                </TapGestureHandler>
            </AnimatedView>
        </PanGestureHandler>
    )
}
