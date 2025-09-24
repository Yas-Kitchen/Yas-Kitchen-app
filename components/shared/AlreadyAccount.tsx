import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type AlreadyProps ={
    main : string
    sub : string
    route :string
}

const AlreadyAccount = ({main,sub,route} : AlreadyProps) => {
  return (
    <View className=" mt-5 flex-row justify-center">
      <Text className="text-center text-faded_black">{main}</Text>
      <TouchableOpacity onPress={() => router.replace(route)}>
        <Text className="text-primary"> {sub}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AlreadyAccount;
