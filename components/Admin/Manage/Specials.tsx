import { useGlobalContext } from "@/context/GlobalContext";
import { useMockSpecials } from "@/hooks/use-MockSpecials";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const Specials = () => {
  const specials = useMockSpecials();
  const {setPopupNames} = useGlobalContext()

  const imageMap: Record<string, any> = {
    "chickencurry.png": require("@/assets/User/chickencurry.png"),
    "eggcurry.png": require("@/assets/User/eggcurry.png"),
    "beefcurry.png": require("@/assets/User/beefcurry.png"),
  };

  return (
    <View className="gap-3">
      <View className="flex-row justify-between items-center">
        <Text className="text-[17px] font-semibold">Today&apos;s Specials</Text>
        <TouchableOpacity onPress={() => setPopupNames('addspecial')} className="flex-row gap-2 p-2 items-center bg-primary rounded-lg">
          <Feather name="plus" color={"#ffffff"} size={18} />
          <Text className="text-sm text-white">Add Special</Text>
        </TouchableOpacity>
      </View>
      <View className="gap-2">
        {Object.entries(specials.specials).map(([i, items]) => (
          <>
            <View
              key={items.id}
              className="bg-[#ECE9E3] rounded-2xl p-5 flex-row"
            >
              <Image
                source={imageMap[items.image]}
                className="w-40 h-40 max-w-40 max-h-40 rounded-lg mr-3"
                resizeMode="cover"
              />
              <View className="flex-col w-1/2 gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-xs font-semibold">{items.name}</Text>
                  <Text className="text-xs font-medium text-primary">
                    AED {items.price}
                  </Text>
                </View>
                <Text className="text-xs text-base_color ">
                  {items.description}
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity className="gap-1 items-center p-2 rounded-lg bg-white/50 flex-row">
                    <Feather name="edit" />
                    <Text className="text-black text-xs">Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="gap-1 items-center flex-row p-2 bg-red/10 rounded-lg">
                    <Feather name="trash" color={"#EF4444"} />
                    <Text className="text-red text-xs">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        ))}
      </View>
    </View>
  );
};

export default Specials;
