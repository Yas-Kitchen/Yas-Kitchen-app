import Detailed from "@/components/Admin/Home/Detailed";
import Summary from "@/components/Admin/Home/Summary";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Admin = () => {
  const [selected, setSelected] = useState("summary");
  const insets = useSafeAreaInsets();

  return (
    <ScrollView>
      <View style={{ paddingTop: insets.top + 20 }}>
        <View className="font-poppins flex-col gap-5">
          <View className="font-poppins flex-row mx-5 justify-between">
            <View className="font-poppins flex-col gap-1">
              <Text className="text-[16px] font-poppins-semibold">Admin Panel</Text>
              <Text className="font-poppins text-[12px] text-base_color">
                Manage your food subscription plan
              </Text>
            </View>
            <Feather name="bell" size={20} />
          </View>
          <View className="font-poppins flex-row mx-5 justify-evenly">
            <TouchableOpacity
              onPress={() => setSelected("summary")}
              className={`${selected === "summary" &&
                "bg-primary/10 text-primary rounded-xl"
                } text-base_color p-3 w-1/2`}
            >
              <Text
                className={`${selected === "summary" ? "text-primary" : "text-base_color"
                  } text-center`}
              >
                Summary
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelected("detailed")}
              className={`${selected === "detailed" &&
                "bg-primary/10 text-primary rounded-xl"
                } text-base_color p-3 w-1/2`}
            >
              <Text
                className={`${selected === "detailed" ? "text-primary" : "text-base_color"
                  } text-center`}
              >
                Detailed
              </Text>
            </TouchableOpacity>
          </View>
          {selected === "summary" ? <Summary /> : <Detailed />}
        </View>
      </View>
      <View style={{ height: insets.bottom + 100 }} />
    </ScrollView>
  );
};

export default Admin;
