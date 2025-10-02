import { useMockMenu } from "@/hooks/use-MockMenu";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const NorthIndian = () => {
  const menu = useMockMenu();

  const imageMap: Record<string, any> = {
    "ricewithfish.png": require("@/assets/User/ricewithfish.png"),
    "chappathiwithvegkurma.png": require("@/assets/User/chappathiwithvegkurma.png"),
    "ricewithmorucurry.png": require("@/assets/User/ricewithmorucurry.png"),
    "porottawithbeef.png": require("@/assets/User/porottawithbeef.png"),
    "ricewithchicken.png": require("@/assets/User/ricewithchicken.png"),
    "chappathiwithCC.png": require("@/assets/User/chappathiwithCC.png"),
    "ricewithsambar.png": require("@/assets/User/ricewithsambar.png"),
    "idiyappamwithgreenpeas.png": require("@/assets/User/idiyappamwithgreenpeas.png"),
    "biriyani.png": require("@/assets/User/biriyani.png"),
    "gheericewithchicken.png": require("@/assets/User/gheericewithchicken.png"),
    "ricewitheggcurry.png": require("@/assets/User/ricewitheggcurry.png"),
    "dosawithfishcurry.png": require("@/assets/User/dosawithfishcurry.png"),
    "meals.png": require("@/assets/User/meals.png"),
    "majboos.png": require("@/assets/User/majboos.png"),
  };

  return (
    <>
      {Object.entries(menu.northindian).map(([day, meals]) => (
        <View key={day} className="mb-6 bg-[#EFECE3] rounded-2xl p-5">
          <Text className="text-primary font-semibold mb-3 capitalize">
            {day}
          </Text>

          {Object.entries(meals as Record<string, any>).map(
            ([mealType, dish]) => (
              <View key={dish.id} className="mb-4">
                <View className="flex-row">
                  <Image
                    source={imageMap[dish.image]}
                    className="w-24 h-24 max-w-24 max-h-24 rounded-lg mr-3"
                    resizeMode="cover"
                  />

                  <View className="flex-1">
                    <View className="flex-row justify-between">
                      <Text className="font-semibold text-sm">{dish.name}</Text>
                      <Text className="text-primary font-medium text-xs capitalize">
                        {mealType}
                      </Text>
                    </View>
                    <Text className="text-base_color text-xs w-[60%]">
                      {dish.description}
                    </Text>

                    <View className="flex-row mt-2">
                      <TouchableOpacity className="bg-white flex-row items-center gap-1 px-3 py-1 rounded-lg mr-2">
                        <Feather name="edit" />
                        <Text>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="bg-primary/10 flex-row gap-1 items-center px-3 py-1 rounded-lg">
                        <Feather name="trash" color={"#FF7629"} />
                        <Text className="text-primary">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )
          )}
        </View>
      ))}
    </>
  );
};

export default NorthIndian;
