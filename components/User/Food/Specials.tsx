import { useGlobalContext } from "@/context/GlobalContext";
import { useExtrasApi } from "@/hooks/useExtrasApi";
import React, { useEffect } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";

const Specials = () => {
  const screenWidth = Dimensions.get("window").width;
  const width = Math.min(Math.max(screenWidth * 0.45, 300), 130);
  const height = width * 0.8;
  const { cart, setCart, setSelectedSpecialItems } = useGlobalContext();
  const { fetchTodaySpecials, specials, loading } = useExtrasApi();

  useEffect(() => {
    fetchTodaySpecials();
    //eslint-disable-next-line
  }, []);

  const isPastCutoff = (cutoffTime: string | undefined) => {
    if (!cutoffTime) return false;
    const now = new Date();
    const [cutoffHour, cutoffMinute] = cutoffTime.split(":").map(Number);
    const cutoffDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      cutoffHour,
      cutoffMinute,
      0
    );
    return now > cutoffDate;
  };

  const sortedItems = [...specials].sort((a, b) => {
    const aExpired = isPastCutoff(a.cutoff_time);
    const bExpired = isPastCutoff(b.cutoff_time);
    if (aExpired === bExpired) return 0;
    return aExpired ? 1 : -1;
  });

  const handleAddToCart = (item: any) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: 1,
    }));
    setSelectedSpecialItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      return exists ? prev : [...prev, item];
    });
  };

  const handleIncrement = (item: any) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
    setSelectedSpecialItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      return exists ? prev : [...prev, item];
    });
  };

  const handleDecrement = (item: any) => {
    setCart((prev) => {
      const newQty = Math.max((prev[item.id] || 1) - 1, 0);
      const updated = { ...prev, [item.id]: newQty };
      return updated;
    });
    setSelectedSpecialItems((prev) => {
      if ((cart[item.id] || 1) - 1 <= 0) {
        return prev.filter((i) => i.id !== item.id);
      }
      return prev;
    });
  };

  if (loading) {
    return (
      <View className="font-poppins my-2.5 gap-4">
        {[1, 2].map((i) => (
          <View key={i} className="font-poppins flex-row items-center gap-2.5">
            <View className="font-poppins w-32 h-[100px] rounded-xl bg-[#E0E0E0] opacity-60" />
            <View className="font-poppins flex-1">
              <View className="font-poppins w-[80%] h-5 rounded-md bg-[#E0E0E0] opacity-60 mb-2" />
              <View className="font-poppins w-[60%] h-4 rounded-md bg-[#E0E0E0] opacity-60" />
            </View>
          </View>
        ))}
      </View>
    );
  }

  if (!loading && specials.length === 0) {
    return (
      <View className="font-poppins mt-12 items-center justify-center">
        <Text className="text-base_color font-poppins-medium text-[14px]">
          No specials available today
        </Text>
      </View>
    );
  }

  return (
    <View className="font-poppins mt-2 gap-3">
      <Text className="text-faded_black font-poppins-semibold text-[17px]">
        Today&apos;s Special Items
      </Text>
      {sortedItems.map((item) => {
        const expired = isPastCutoff(item.cutoff_time);
        return (
          <View
            key={item.id}
            className={`bg-[#EFEDE6] border border-base_color/20 rounded-xl py-5 ${
              expired ? "opacity-50" : ""
            }`}
            pointerEvents={expired ? "none" : "auto"}
          >
            <View className="font-poppins flex-row">
              <View className="font-poppins relative">
                <Image
                  className="font-poppins p-2 rounded-lg"
                  style={{ width, height }}
                  source={{ uri: item.image_url }}
                />
                {expired && (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 10,
                    }}
                  />
                )}
              </View>
              <View className="font-poppins flex-col">
                <Text className="text-[14px] font-poppins-semibold">{item.name}</Text>
                <Text className="font-poppins w-[80%] h-fit max-w-[80%] text-[12px] text-base_color mt-1">
                  {item.description}
                </Text>
                {cart[item.id] ? (
                  <View className="font-poppins flex-row items-center mt-2">
                    <TouchableOpacity
                      onPress={() => handleDecrement(item)}
                      className="font-poppins bg-gray-200 w-8 h-8 rounded-full items-center justify-center"
                      activeOpacity={0.7}
                      disabled={expired}
                    >
                      <Text className="font-poppins text-lg">-</Text>
                    </TouchableOpacity>

                    <Text className="mx-2 font-poppins-semibold">{cart[item.id]}</Text>

                    <TouchableOpacity
                      onPress={() => handleIncrement(item)}
                      className="font-poppins bg-orange-500 w-8 h-8 rounded-full items-center justify-center"
                      activeOpacity={0.7}
                      disabled={expired}
                    >
                      <Text className="font-poppins text-white text-lg">+</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleAddToCart(item)}
                    className="font-poppins bg-primary/10 w-28 items-center p-2 rounded-xl mt-2"
                    activeOpacity={0.7}
                    disabled={expired}
                  >
                    <Text className="font-poppins text-primary text-[12px]">
                      Add to Order
                    </Text>
                  </TouchableOpacity>
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

export default Specials;
