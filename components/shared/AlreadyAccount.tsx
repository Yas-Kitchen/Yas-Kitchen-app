import { router } from "expo-router";
import { UrlObject } from "expo-router/build/global-state/routeInfo";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type AlreadyProps ={
    main : string
    sub : string
    route : UrlObject | ((string & {}) | "/(login)" | "/(register)");
}

const AlreadyAccount = ({main,sub,route} : AlreadyProps) => {
  return (
    <View className=" mt-5 flex-row justify-center">
      <Text className="text-center text-black">{main}</Text>
      <TouchableOpacity onPress={() => router.push(route)}>
        <Text className="text-primary"> {sub}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AlreadyAccount;
