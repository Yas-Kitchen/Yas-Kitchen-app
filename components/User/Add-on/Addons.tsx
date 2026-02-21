import { useGlobalContext } from "@/context/GlobalContext";
import { useExtrasApi } from "@/hooks/useExtrasApi";
import {
  addAddonItem,
  decrementAddon,
  incrementAddon,
} from "@/utils/addonCart.util";
import React, { useState, useEffect, useMemo } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AddonsItems = () => {
  const screenWidth = Dimensions.get("window").width;
  const width = Math.min(Math.max(screenWidth * 0.45, 300), 130);
  const height = width * 0.8;

  const { fetchAddons, loading } = useExtrasApi();
  const { selectedAddonItems, setSelectedAddonItems, cart, setCart } =
    useGlobalContext();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const loadAddons = async () => {
      try {
        const data = await fetchAddons();
        if (data && Array.isArray(data)) setItems(data);
      } catch (err) {
        console.log("Failed to fetch addons:", err);
      }
    };
    loadAddons();
    //eslint-disable-next-line
  }, []);

  const isPastCutoff = (cutoffTime: string) => {
    if (!cutoffTime) return false;
    const now = new Date();
    const [hours, minutes] = cutoffTime.split(":").map(Number);
    const cutoff = new Date();
    cutoff.setHours(hours, minutes, 0, 0);
    return now > cutoff;
  };

  const availableItems = items.filter(
    (item) => !isPastCutoff(item.cutoff_time),
  );
  const expiredItems = items.filter((item) => isPastCutoff(item.cutoff_time));
  const sortedItems = [...availableItems, ...expiredItems];

  const buttonPressAnimations = useMemo(() => {
    const animations: { [key: string]: Animated.Value } = {};
    items.forEach((item) => (animations[item.id] = new Animated.Value(1)));
    return animations;
  }, [items]);

  const quantityAnimations = useMemo(() => {
    const animations: { [key: string]: Animated.Value } = {};
    items.forEach((item) => (animations[item.id] = new Animated.Value(1)));
    return animations;
  }, [items]);

  const animateButtonPress = (itemId: string, callback: () => void) => {
    const animation = buttonPressAnimations[itemId];
    if (!animation) {
      callback();
      return;
    }

    Animated.timing(animation, {
      toValue: 0.95,
      duration: 80,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(animation, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }).start();
      callback();
    });
  };

  const animateQuantityChange = (itemId: string) => {
    const animation = quantityAnimations[itemId];
    if (!animation) return;

    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAddToCart = (item: any) => {
    animateButtonPress(item.id, () => {
      addAddonItem(
        cart,
        selectedAddonItems,
        setCart,
        setSelectedAddonItems,
        item,
      );
    });
  };

  const handleIncrement = (item: any) => {
    animateQuantityChange(item.id);
    incrementAddon(cart, setCart, item.id);
  };

  const handleDecrement = (item: any) => {
    animateQuantityChange(item.id);
    decrementAddon(
      cart,
      selectedAddonItems,
      setCart,
      setSelectedAddonItems,
      item.id,
    );
  };

  if (loading) {
    return (
      <View className="font-poppins items-center justify-center py-10">
        <Text className="font-poppins text-base_color">Loading Add-ons...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View className="font-poppins items-center justify-center py-10">
        <Text className="font-poppins text-gray-500">
          No add-ons available today 😞
        </Text>
      </View>
    );
  }

  return (
    <View className="font-poppins mt-2 gap-3">
      {sortedItems.map((item: any) => {
        const expired = isPastCutoff(item.cutoff_time);
        return (
          <View
            key={item.id}
            className={`bg-[#EFEDE6] border border-base_color/20 rounded-xl ${
              expired ? "opacity-50 grayscale" : ""
            }`}
            style={{ paddingVertical: 20, paddingHorizontal: 12 }}
            pointerEvents={expired ? "none" : "auto"}
          >
            <View className="font-poppins gap-2 flex-row">
              <Image
                style={{ width, height }}
                className="font-poppins rounded-md"
                source={{ uri: item.image_url }}
              />
              <View className="font-poppins flex-col">
                <Text className="text-[14px] font-poppins-semibold">
                  {item.name}
                </Text>
                <Text className="font-poppins w-[80%] text-[12px] text-base_color mt-1">
                  {item.description}
                </Text>

                {cart[item.id] ? (
                  <View className="font-poppins flex-row items-center gap-3 mt-2">
                    <Animated.View
                      style={{
                        transform: [{ scale: buttonPressAnimations[item.id] }],
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleDecrement(item)}
                        className="font-poppins bg-primary/10 w-8 h-8 items-center justify-center rounded-xl"
                        activeOpacity={0.7}
                      >
                        <Text className="text-primary text-[20px] font-poppins-bold">
                          -
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>

                    <Animated.Text
                      style={{
                        transform: [{ scale: quantityAnimations[item.id] }],
                      }}
                      className="text-primary font-poppins-semibold text-[16px]"
                    >
                      {cart[item.id]}
                    </Animated.Text>

                    <Animated.View
                      style={{
                        transform: [{ scale: buttonPressAnimations[item.id] }],
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleIncrement(item)}
                        className="font-poppins bg-primary/10 w-8 h-8 items-center justify-center rounded-xl"
                        activeOpacity={0.7}
                      >
                        <Text className="text-primary text-[20px] font-poppins-bold">
                          +
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                ) : (
                  <Animated.View
                    style={{
                      transform: [{ scale: buttonPressAnimations[item.id] }],
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleAddToCart(item)}
                      className="font-poppins bg-primary/10 w-28 items-center p-2 rounded-xl mt-2"
                      activeOpacity={0.7}
                    >
                      <Text className="font-poppins text-primary text-[12px]">
                        Add to Cart
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>

              <View className="font-poppins flex-row items-center gap-1 mr-5 absolute right-0">
                <Image
                  className="font-poppins w-2.5 h-2.5"
                  source={require("@assets/Shared/dirham.svg")}
                />
                <Text className="text-primary font-poppins-medium text-[13px]">
                  {item.price}
                </Text>
              </View>

              <Text className="text-base_color absolute bottom-0 right-3 font-poppins-medium text-[9px]">
                {item.cutoff_time}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default AddonsItems;
