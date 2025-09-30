import Detailed from "@/components/Admin/Home/Detailed";
import Summary from "@/components/Admin/Home/Summary";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const Admin = () => {
  const [selected, setSelected] = useState("summary");
  return (
    <ScrollView>
    <View className="mx-5 ios:mt-16 mt-5">
      <View className="flex-col gap-5">
        <View className="flex-row justify-between">
          <View className="flex-col gap-1">
            <Text className="text-[16px] font-semibold">Admin Panel</Text>
            <Text className="text-[12px] text-base_color">
              Manage your food subscription plan
            </Text>
          </View>
          <Feather name="bell" size={20} />
        </View>
        <View className="flex-row justify-evenly">
          <TouchableOpacity
            onPress={() => setSelected("summary")}
            className={`${
              selected === "summary" && "bg-primary/10 text-primary rounded-xl"
            } text-base_color p-3 w-1/2`}
          >
            <Text
              className={`${
                selected === "summary" ? "text-primary" : "text-base_color"
              } text-center`}
            >
              Summary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelected("detailed")}
            className={`${
              selected === "detailed" && "bg-primary/10 text-primary rounded-xl"
            } text-base_color p-3 w-1/2`}
          >
            <Text
              className={`${
                selected === "detailed" ? "text-primary" : "text-base_color"
              } text-center`}
            >
              Detailed
            </Text>
          </TouchableOpacity>
        </View>
        {selected === 'summary' ? <Summary/> : <Detailed/>}
      </View>
    </View>
    <View className="h-32"/>
    </ScrollView>
  );
};

export default Admin;
