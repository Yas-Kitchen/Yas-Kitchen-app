import { useGlobalContext } from "@/context/GlobalContext";
import { useMealsAPI } from "@/hooks/useMealsAPI";
import { CuisineItemProps } from "@/types/meals.types";
import { getCuisineNameByID } from "@/utils/cuisine.util";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
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
  const { setFoodStyle, categories, setCategories } = useGlobalContext();
  const { fetchCuisineDetails, loading } = useMealsAPI();
  const [cuisineName, setCuisineName] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCuisineDetails();
      if (data && data.length > 0) {
        setCategories(data);
      }
    };
    loadCategories();

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const updateFoodStyle = async () => {
      if (cuisineName) {
        const name = await getCuisineNameByID(cuisineName);
        setFoodStyle(name);
      }
    };
    updateFoodStyle();
    //eslint-disable-next-line
  }, [cuisineName]);

  if (loading) {
    return (
      <View className="font-poppins mt-3 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#FF6F00" />
        <Text className="font-poppins text-base_color mt-2">Loading cuisines...</Text>
      </View>
    );
  }

  if (categories.length === 0) {
    return (
      <View className="font-poppins mt-3 items-center justify-center py-10">
        <Text className="font-poppins text-red-500">No cuisines available</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get("window").width;
  const itemWidth = Math.min(
    Math.max((screenWidth - 60) / Math.min(categories.length, 3), 120),
    160
  );
  const itemHeight = itemWidth * 0.9;

  return (
    <View className="font-poppins mt-3">
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
            isSelected={cuisineName === cuisine.id}
            onSelect={() => setCuisineName(cuisine.id)}
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
    <View className="font-poppins items-center">
      <TouchableOpacity onPress={onSelect}>
        <Animated.Image
          source={getImageSource()}
          style={[animatedStyle, { width, height, borderRadius: 16, marginBlockStart: 5 }]}
        />
      </TouchableOpacity>
      <Text
        className={`text-[14px] mt-2 text-center ${isSelected ? "text-primary font-poppins-semibold" : "text-base_color"
          }`}
      >
        {cuisine?.name || "Unknown"}
      </Text>
    </View>
  );
};

export default FoodStyle;
