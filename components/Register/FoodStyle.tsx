import { useGlobalContext } from "@/context/GlobalContext";
import { useRegisterAPI } from "@/hooks/Register/useRegisterAPI";
import { CuisineItemProps } from "@/types/register.types";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const FoodStyle = () => {
  const { foodStyle, setFoodStyle, categories, setCategories } =
    useGlobalContext();
  const { fetchCuisineDetails } = useRegisterAPI();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const res = await fetchCuisineDetails();

        let cuisineData = [];
        if (res?.data) {
          cuisineData = res.data;
        } else if (Array.isArray(res)) {
          cuisineData = res;
        }

        console.log("Fetched cuisines:", cuisineData);
        setCategories(cuisineData);

        if (cuisineData.length > 0 && !foodStyle) {
          setFoodStyle(cuisineData[0].id); 
        }
      } catch (err) {
        console.error("Failed to fetch cuisines:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
    //eslint-disable-next-line
  }, []);

  if (isLoading) {
    return (
      <View className="mt-3 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#FF6F00" />
        <Text className="text-base_color mt-2">Loading cuisines...</Text>
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View className="mt-3 items-center justify-center py-10">
        <Text className="text-red-500">No cuisines available</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get("window").width;
  const itemWidth = Math.min(
    Math.max((screenWidth - 60) / Math.min(categories.length, 3), 120),
    160
  );
  const itemHeight = itemWidth * 0.90;
  
  return (
    <View className="mt-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 16,
          paddingHorizontal: 10,
        }}
      >
        {categories.map((cuisine) => (
          <CuisineItem
            key={cuisine.id}
            cuisine={cuisine}
            isSelected={foodStyle === cuisine.id}
            onSelect={() => setFoodStyle(cuisine.id)}
            width={itemWidth}
            height={itemHeight}
          />
        ))}
      </ScrollView>
    </View>
  );
};



const CuisineItem: React.FC<CuisineItemProps> = ({
  cuisine,
  isSelected,
  onSelect,
  width,
  height,
}) => {
  const scale = useSharedValue(1);
  const borderValue = useSharedValue(0);

  useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.05);
      borderValue.value = withSpring(1);
    } else {
      scale.value = withSpring(1);
      borderValue.value = withSpring(0);
    }
    //eslint-disable-next-line
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: interpolateColor(
      borderValue.value,
      [0, 1],
      ["transparent", "#FF6F00"]
    ),
    borderWidth: borderValue.value > 0 ? 2 : 0,
  }));

  const getImageSource = () => {
    const cuisineName = (cuisine?.name || cuisine?.label || "").toLowerCase();

    if (cuisineName.includes("north")) {
      return require("@assets/Shared/north_indian.png");
    } else if (cuisineName.includes("south")) {
      return require("@assets/Shared/south_indian.png");
    }

    if (cuisine?.image_url) {
      return { uri: cuisine.image_url };
    }

    return require("@assets/Shared/north_indian.png");
  };

  return (
    <View className="items-center">
      <TouchableOpacity onPress={onSelect}>
        <Animated.Image
          className="rounded-2xl"
          source={getImageSource()}
          style={[animatedStyle, { width, height }]}
        />
      </TouchableOpacity>
      <Text
        className={`text-[14px] mt-2 text-center ${
          isSelected ? "text-primary font-semibold" : "text-base_color"
        }`}
      >
        {cuisine?.name || "Unknown"}
      </Text>
    </View>
  );
};

export default FoodStyle;
