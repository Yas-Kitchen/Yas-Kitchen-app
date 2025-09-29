import { useGlobalContext } from "@/context/GlobalContext";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

const Fadebg = () => {
  const { popupNames } = useGlobalContext();
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (popupNames) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [opacity, popupNames]);
  return (
    <Animated.View
  style={[
    {
      opacity,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      pointerEvents: popupNames ? "auto" : "none",
      zIndex : 10
    },
  ]}
/>
  );
};

export default Fadebg;
