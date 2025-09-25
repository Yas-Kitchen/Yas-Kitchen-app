import { useMockSpecials } from "@/hooks/use-MockSpecials";
import React from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const Specials = () => {
  const screenWidth = Dimensions.get("window").width;
  const width = Math.min(Math.max(screenWidth * 0.45, 300), 130);
  const height = width * 0.8;
  const mobile = 8547266801;

  const imageMap: Record<string, any> = {
    "chickencurry.png": require("../../../assets/User/chickencurry.png"),
    "beefcurry.png": require("../../../assets/User/beefcurry.png"),
    "chickenfry.png": require("../../../assets/User/chickenfry.png"),
    "curd.png": require("../../../assets/User/curd.png"),
    "eggcurry.png": require("../../../assets/User/eggcurry.png"),
  };

  const specials = useMockSpecials();
  const items = specials.specials;
  const [cart, setCart] = React.useState<{ [key: string]: number }>({});
  
  // Animation values - smooth and subtle
  const cartAnimation = React.useRef(new Animated.Value(0)).current;
  
  const quantityAnimations = React.useMemo(() => {
    const animations: { [key: string]: Animated.Value } = {};
    items.forEach((item) => {
      animations[item.id] = new Animated.Value(1);
    });
    return animations;
  }, [items]);

  const buttonPressAnimations = React.useMemo(() => {
    const animations: { [key: string]: Animated.Value } = {};
    items.forEach((item) => {
      animations[item.id] = new Animated.Value(1);
    });
    return animations;
  }, [items]);

  // Smooth cart popup visibility with ease-out timing
  React.useEffect(() => {
    const hasItems = Object.keys(cart).filter(key => cart[key] > 0).length > 0;
    
    if (hasItems) {
      Animated.timing(cartAnimation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(cartAnimation, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [cart, cartAnimation]);

  // Subtle quantity change animation
  const animateQuantityChange = (itemId: string) => {
    if (!quantityAnimations[itemId]) return;
    
    Animated.timing(quantityAnimations[itemId], {
      toValue: 1.05,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(quantityAnimations[itemId], {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  };

  // Subtle button press animation
  const animateButtonPress = (itemId: string, callback: () => void) => {
    if (!buttonPressAnimations[itemId]) {
      callback();
      return;
    }
    
    Animated.timing(buttonPressAnimations[itemId], {
      toValue: 0.95,
      duration: 80,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(buttonPressAnimations[itemId], {
        toValue: 1,
        duration: 80,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
      callback();
    });
  };

  const handleAddToCart = (itemId: string) => {
    animateButtonPress(itemId, () => {
      setCart((prev) => ({
        ...prev,
        [itemId]: 1,
      }));
      animateQuantityChange(itemId);
    });
  };

  const handleIncrement = (itemId: string) => {
    animateButtonPress(itemId, () => {
      setCart((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));
      animateQuantityChange(itemId);
    });
  };

  const handleDecrement = (itemId: string) => {
    animateButtonPress(itemId, () => {
      setCart((prev) => ({
        ...prev,
        [itemId]: Math.max((prev[itemId] || 1) - 1, 0),
      }));
      animateQuantityChange(itemId);
    });
  };

  // Helper functions with fallback values
  const getQuantityAnimation = (itemId: string) => {
    return quantityAnimations[itemId] || new Animated.Value(1);
  };

  const getButtonAnimation = (itemId: string) => {
    return buttonPressAnimations[itemId] || new Animated.Value(1);
  };

  return (
    <View className="mt-2 gap-3">
      <Text className="text-faded_black font-semibold text-[17px]">
        Today&apos;s Special Items
      </Text>
      {items.map((item) => (
        <View
          key={item.id}
          className="bg-[#EFEDE6] border border-base_color/20 rounded-xl py-5"
        >
          <View className="flex-row">
            <Image style={{ width, height }} source={imageMap[item.image]} />
            <View className="flex-col">
              <Text className="text-[14px] font-semibold">{item.name}</Text>
              <Text className="w-[80%] text-[12px] text-base_color mt-1">
                {item.description}
              </Text>
              {cart[item.id] ? (
                <View className="flex-row items-center mt-2">
                  <Animated.View style={{ transform: [{ scale: getButtonAnimation(item.id) }] }}>
                    <TouchableOpacity
                      onPress={() => handleDecrement(item.id)}
                      className="bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
                      activeOpacity={0.7}
                    >
                      <Text className="text-lg">-</Text>
                    </TouchableOpacity>
                  </Animated.View>
                  
                  <Animated.Text 
                    style={{ transform: [{ scale: getQuantityAnimation(item.id) }] }}
                    className="mx-2 font-semibold"
                  >
                    {cart[item.id]}
                  </Animated.Text>
                  
                  <Animated.View style={{ transform: [{ scale: getButtonAnimation(item.id) }] }}>
                    <TouchableOpacity
                      onPress={() => handleIncrement(item.id)}
                      className="bg-orange-500 w-8 h-8 rounded-full items-center justify-center"
                      activeOpacity={0.7}
                    >
                      <Text className="text-white text-lg">+</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              ) : (
                <Animated.View style={{ transform: [{ scale: getButtonAnimation(item.id) }] }}>
                  <TouchableOpacity
                    onPress={() => handleAddToCart(item.id)}
                    className="bg-primary/10 w-28 items-center p-2 rounded-xl mt-2"
                    activeOpacity={0.7}
                  >
                    <Text className="text-primary text-[12px]">Add to Order</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
            <View className="flex-row items-center gap-1 mr-5 absolute right-0">
              <Image
                className="w-2.5 h-2.5"
                source={require("@assets/Shared/dirham.svg")}
              />
              <Text className="text-primary font-medium text-[13px]">
                {item.price}
              </Text>
            </View>
            <Text className="text-base_color absolute bottom-0 right-3 font-medium text-[9px]">
              {item.order_deadline}
            </Text>
          </View>
        </View>
      ))}
      
      {/* Smooth Cart Popup */}
      <Animated.View
        style={{
          transform: [
            {
              translateY: cartAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [80, 0],
              }),
            },
          ],
          opacity: cartAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        }}
        className="absolute -bottom-60 left-0 right-0 bg-white shadow-lg shadow-black/20 p-4 flex-row justify-between items-center rounded-xl mx-4"
        pointerEvents={Object.keys(cart).filter(key => cart[key] > 0).length > 0 ? 'auto' : 'none'}
      >
        <View>
          <Text className="text-gray-600">
            {Object.values(cart).reduce((a, b) => a + b, 0)} items
          </Text>
          <Text className="font-semibold text-lg text-black">
            AED&nbsp;
            {items.reduce(
              (total, item) => total + (cart[item.id] || 0) * Number(item.price),
              0
            )}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => {
            const orderItems = items
              .filter((item) => cart[item.id])
              .map((item) => `${cart[item.id]} ${item.name} plate${cart[item.id] > 1 ? "s" : ""}`)
              .join(", ");
            const message = `Hello, I would like to order: ${orderItems}`;
            const url = `whatsapp://send?phone=+91${mobile}&text=${encodeURIComponent(message)}`;
            Linking.openURL(url).catch(() => {
              alert("Make sure WhatsApp is installed on your device");
            });
          }}
          className="bg-orange-500 px-6 py-3 rounded-xl"
          activeOpacity={0.7}
        >
          <Text className="text-white font-semibold">Place Order</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Specials;
