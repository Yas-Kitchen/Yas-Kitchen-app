import EditProfile from "@/components/Profile/EditProfile";
import MainSetting from "@/components/Profile/MainSetting";
import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
  const { name, mobile, address, foodStyle, monthlyPlan, kidsPlanSelected } =
    useGlobalContext();
    console.log(foodStyle,monthlyPlan);
    
  return (
    <ScrollView>
      <View className="ios:mt-16 mt-5 mx-5">
        <Text className="text-[#212529] font-semibold text-[16px]">
          Profile
        </Text>
        <View className="mt-5 flex-row gap-4 items-center mb-4">
          <Image className="w-20 h-20 bg-primary rounded-full " />
          <View className="gap-1">
            <Text className="text-[17px] font-semibold">{name}</Text>
            <Text className="text-base_color text-[13px]">{mobile}</Text>
          </View>
        </View>
        <View className="bg-white/50 rounded-xl border border-base_color/10">
          <EditProfile header="Name" subheader={name} icon="user" />
          <View className="h-[1px] w-full bg-base_color/10" />
          <EditProfile
            header="Delivery Address"
            subheader={address}
            icon="map-pin"
          />
        </View>
        <View className="bg-white/50 mt-10 rounded-xl border border-base_color/10">
          <MainSetting
            icon="fast-food-outline"
            header="Monthly Food Plan"
            subheader={
              kidsPlanSelected ? `Kidsplan with ${monthlyPlan}` : monthlyPlan
            }
          />
          <View className="h-[1px] w-full bg-base_color/10" />
          <MainSetting
            icon="pizza-outline"
            header="Switch Meals"
            subheader={`${foodStyle} indian`}
          />
          <View className="h-[1px] w-full bg-base_color/10" />
          <MainSetting
            icon="add-circle-outline"
            header="Add Meal"
            subheader="Order for one more"
          />
          <View className="h-[1px] w-full bg-base_color/10" />
          <MainSetting
            icon="share-outline"
            header="Share App"
            subheader="Share the flavor!"
          />
        </View>
        <TouchableOpacity onPress={() => router.push("/")} className="flex-row items-center gap-2 bg-white justify-center p-5 rounded-2xl mt-5">
          <Feather name="log-out" color={"#FF7629"} size={20} />
          <Text className="text-primary">Logout</Text>
        </TouchableOpacity>
      </View>
      <View className="h-32"/>
    </ScrollView>
  );
};

export default Profile;
