import React from "react";
import LottieView from 'lottie-react-native';

export const Loading = () => (
    <LottieView
        autoPlay
        loop
        source={require('../Assets/226-splashy-loader.json')}
    />
)