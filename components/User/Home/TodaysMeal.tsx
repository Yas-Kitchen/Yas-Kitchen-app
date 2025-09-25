import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";

const imageMap: Record<string, any> = {
  "beefcurry.png": require("../../../assets/User/beefcurry.png"),
  "biriyani.png": require("../../../assets/User/biriyani.png"),
  "chappathiwithCC.png": require("../../../assets/User/chappathiwithCC.png"),
  "chappathiwithvegkurma.png": require("../../../assets/User/chappathiwithvegkurma.png"),
  "chickencurry.png": require("../../../assets/User/chickencurry.png"),
  "chickenfry.png": require("../../../assets/User/chickenfry.png"),
  "curd.png": require("../../../assets/User/curd.png"),
  "diet_meal.png": require("../../../assets/User/diet_meal.png"),
  "dosa.png": require("../../../assets/User/dosa.png"),
  "dosawithfishcurry.png": require("../../../assets/User/dosawithfishcurry.png"),
  "eggcurry.png": require("../../../assets/User/eggcurry.png"),
  "gheericewithchicken.png": require("../../../assets/User/gheericewithchicken.png"),
  "idiyappamwithgreenpeas.png": require("../../../assets/User/idiyappamwithgreenpeas.png"),
  "idliwithsambar.png": require("../../../assets/User/idliwithsambar.png"),
  "kondattam.png": require("../../../assets/User/kondattam.png"),
  "meals.png": require("../../../assets/User/meals.png"),
  "pappadam.png": require("../../../assets/User/pappadam.png"),
  "porottawithbeef.png": require("../../../assets/User/porottawithbeef.png"),
  "ricewithchicken.png": require("../../../assets/User/ricewithchicken.png"),
  "ricewitheggcurry.png": require("../../../assets/User/ricewitheggcurry.png"),
  "ricewithfish.png": require("../../../assets/User/ricewithfish.png"),
  "ricewithmorucurry.png": require("../../../assets/User/ricewithmorucurry.png"),
  "ricewithsambar.png": require("../../../assets/User/ricewithsambar.png"),
};

type MealTypes = {
  name: string;
  description: string;
  rating: number;
  availability: string;
  lunch: boolean;
  image: string;
};

const TodaysMeal = ({
  name,
  description,
  rating,
  availability,
  lunch,
  image,
}: MealTypes) => {
  const screenWidth = Dimensions.get("window").width;
  const width = Math.min(Math.max(screenWidth * 0.45, 300), 400);
  const height = width * 0.72;

  const [isClicked, setIsClicked] = useState(false);
  const [newRating, setNewRating] = useState<number | null>(null);
  const [tempRating, setTempRating] = useState(0);

  const stars = [1, 2, 3, 4, 5];

  return (
    <View>
      <View className="border-2 bg-[#F1EFE8] border-primary rounded-2xl overflow-hidden items-center">
        <Image style={{ width, height }} source={imageMap[image]} />
        <View className="bg-white p-3 gap-2">
          <View className="flex-row justify-between">
            <Text className="text-[16px] font-semibold">
              {lunch ? "Lunch:" : "Dinner:"} {name}
            </Text>
            <View className="bg-button_bg/10 mx-2 flex-row gap-1 rounded-lg p-1">
              <FontAwesome name="star" size={16} color="#FFC107" />
              <Text className="text-[12px] font-medium">{rating}</Text>
            </View>
          </View>

          <View className="flex-row w-full justify-between">
            <Text className="w-[70%] leading-5 text-base_color text-[12px]">
              {description}
            </Text>

            {isClicked ? (
              <View className="flex-row gap-[1px] mr-2">
                {stars.map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setNewRating(star)}
                    onPressIn={() => setTempRating(star)}
                    onPressOut={() => setTempRating(0)}
                  >
                    <Animated.View
                      layout={Layout.springify()}
                      entering={FadeIn}
                      exiting={FadeOut}
                    >
                      <FontAwesome
                        name="star"
                        size={16}
                        color={
                          star <= (tempRating || newRating || rating)
                            ? "#FFC107"
                            : "#ccc"
                        }
                      />
                    </Animated.View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setIsClicked(true)}
                className="rounded-full bg-button_bg p-2 h-10 w-14 items-center justify-center"
              >
                <Text className="font-medium text-[12px]">Rate</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text className="absolute top-2 right-2 bg-button_bg/30 p-2 rounded-full text-[10px] font-medium">
          {availability}
        </Text>
      </View>
    </View>
  );
};

export default TodaysMeal;
