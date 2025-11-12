import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Linking } from "react-native";
import { useGlobalContext } from "@/context/GlobalContext";

const Cart = () => {
  const { cart, selectedAddonItems, selectedSpecialItems } = useGlobalContext();
  const mobile = 8547266801;
  const cartAnimation = useRef(new Animated.Value(0)).current;

  const hasItems = Object.values(cart).some((q) => q > 0);

  useEffect(() => {
    Animated.timing(cartAnimation, {
      toValue: hasItems ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    //eslint-disable-next-line
  }, [hasItems]);

  const activeItems = [...selectedSpecialItems, ...selectedAddonItems];

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = activeItems.reduce(
    (sum, item) => sum + (cart[item.id] || 0) * Number(item.price || 0),
    0
  );

  const handlePlaceOrder = () => {
    if (!hasItems) return;

    const orderList = activeItems
      .filter((item) => cart[item.id])
      .map((item) => `${cart[item.id]} x ${item.name} (AED ${item.price})`)
      .join(", ");

    const message = `Hello, I would like to order the following items: ${orderList}. Total AED ${totalPrice}`;
    const url = `whatsapp://send?phone=+91${mobile}&text=${encodeURIComponent(
      message
    )}`;

    Linking.openURL(url).catch(() => alert("Install WhatsApp to continue"));
  };

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 100,
        zIndex: 100,
        transform: [
          {
            translateY: cartAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [120, 0],
            }),
          },
        ],
        opacity: cartAnimation,
      }}
      className="bg-white shadow-lg shadow-black/20 p-4 flex-row justify-between items-center rounded-2xl mx-4 mb-4"
      pointerEvents={hasItems ? "auto" : "none"}
    >
      <View>
        <Text className="text-gray-600">
          {totalItems} item{totalItems > 1 ? "s" : ""}
        </Text>
        <Text className="font-semibold text-lg text-black">
          AED {totalPrice}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handlePlaceOrder}
        className="bg-orange-500 px-6 py-3 rounded-xl"
        activeOpacity={0.7}
      >
        <Text className="text-white font-semibold">Place Order</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Cart;
