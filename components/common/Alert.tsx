import {
    Modal,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Platform,
} from 'react-native';
import React, { useEffect } from 'react';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export interface AlertButton {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertProps {
    visible: boolean;
    title?: string;
    message?: string;
    buttons?: AlertButton[];
    onClose: () => void;
}

export default function Alert({ visible, title, message, buttons, onClose }: AlertProps) {
    useEffect(() => {
        if (visible && Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, [visible]);

    if (!visible) return null;

    const alertButtons = buttons && buttons.length > 0 ? buttons : [{ text: 'OK', onPress: onClose }];

    const Container = Platform.OS === 'web' ? View : Animated.View;
    const InnerContainer = Platform.OS === 'web' ? View : Animated.View;

    const content = (
        <Container
            {...(Platform.OS !== 'web'
                ? { entering: FadeIn.duration(200), exiting: FadeOut.duration(200) }
                : {})}
            className="font-poppins flex-1 items-center justify-center bg-black/40 h-full w-full absolute top-0 left-0 z-50 p-5"
            style={
                Platform.OS === 'web'
                    ? ({
                        position: 'fixed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 2147483647, // Max z-index to ensure it shows above Razorpay modal
                    } as any)
                    : {}
            }>
            <InnerContainer
                {...(Platform.OS !== 'web'
                    ? { entering: ZoomIn.duration(250), exiting: ZoomOut.duration(200) }
                    : {})}
                style={{
                    backgroundColor: 'white',
                    borderColor: 'black',
                    borderWidth: 0, // Removed border
                    borderRadius: 24, // Increased border radius
                }}
                className="font-poppins w-full max-w-[320px] overflow-hidden rounded-3xl bg-white shadow-xl">
                <View className="font-poppins items-center p-6 pb-5">
                    {title && (
                        <Text className="mb-2 text-center font-poppins-semibold text-[17px] text-faded_black">
                            {title}
                        </Text>
                    )}
                    {message && (
                        <Text className="text-center font-poppins text-[13px] leading-[20px] text-base_color">
                            {message}
                        </Text>
                    )}
                </View>

                <View className="font-poppins h-[0.5px] w-full bg-base_color/20" />

                <View className={`flex-row ${alertButtons.length > 2 ? 'flex-col' : ''}`}>
                    {alertButtons.map((btn, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && (
                                <View
                                    className={
                                        alertButtons.length > 2
                                            ? 'h-[0.5px] w-full bg-base_color/20'
                                            : 'h-full w-[0.5px] bg-base_color/20'
                                    }
                                />
                            )}
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    if (btn.onPress) btn.onPress();
                                    // For "OK" or "Cancel" types usage where developer didn't pass onPress
                                    // but also generally we might want to close unless stated otherwise
                                    // but the pattern usually is `onPress` handles specific logic.
                                    // The implementation plan says useAlert will handle this nicely.
                                    // actually, let's keep it simple: developer must close it via context or we auto close?
                                    // Native alert auto closes.
                                    // We'll handle onClose in context wrapper, but visual feedback is immediate.
                                }}
                                className={`flex-1 items-center justify-center p-[16px] ${alertButtons.length > 2 ? 'w-full' : ''}`}>
                                <Text
                                    className={`text-[15px] ${btn.style === 'destructive' ? 'font-poppins-medium text-red' : btn.style === 'cancel' ? 'font-poppins-semibold text-primary' : 'font-poppins-medium text-primary'}`}>
                                    {btn.text}
                                </Text>
                            </TouchableOpacity>
                        </React.Fragment>
                    ))}
                </View>
            </InnerContainer>
        </Container>
    );



    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            {content}
        </Modal>
    );
}
