import EditProfile from "@/components/Profile/EditProfile";
import MainSetting from "@/components/Profile/MainSetting";
import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserAPI } from "@/hooks/useUserAPI";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const { name, mobile, address, foodStyle, getMonthlyPlanText, userProfile } =
    useGlobalContext();

  const [profileImage, setProfileImage] = useState<string | null>(
    userProfile || null
  );
  const [loading, setLoading] = useState(false);

  const { setProfileImage: setProfileImageAPI } = useUserAPI();

  useEffect(() => {
    if (userProfile) {
      setProfileImage(userProfile);
    }
  }, [userProfile]);

  return (
    <ScrollView>
      <View className="ios:mt-16 mt-5 mx-5">
        <Text className="text-[#212529] font-semibold text-[16px]">
          Profile
        </Text>
        <View className="mt-5 flex-row gap-4 items-center mb-4">
          <TouchableOpacity
            onPress={async () => {
              const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (!permissionResult.granted) {
                Alert.alert(
                  "Permission required",
                  "Please allow access to your gallery."
                );
                return;
              }
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
              });

              if (!result.canceled) {
                setLoading(true);
                const imageUri = result.assets[0].uri;
                setProfileImage(imageUri);
                await setProfileImageAPI(imageUri);
                setProfileImage(imageUri);
                setLoading(false);
              }
            }}
            className="w-20 h-20 rounded-full bg-primary items-center justify-center overflow-hidden"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : profileImage ? (
              <Image
                source={{ uri: profileImage }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <Feather name="upload" size={24} color="#fff" />
            )}
          </TouchableOpacity>
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
            subheader={getMonthlyPlanText()}
          />
          <View className="h-[1px] w-full bg-base_color/10" />
          <MainSetting
            icon="pizza-outline"
            header="Switch Meals"
            subheader={`${foodStyle}`}
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
        <TouchableOpacity
          onPress={() => router.push("/")}
          className="flex-row items-center gap-2 bg-white justify-center p-5 rounded-2xl mt-5"
        >
          <Feather name="log-out" color={"#FF7629"} size={20} />
          <Text className="text-primary">Logout</Text>
        </TouchableOpacity>
      </View>
      <View className="h-32" />
    </ScrollView>
  );
};

export default Profile;
