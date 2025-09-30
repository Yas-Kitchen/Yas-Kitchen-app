import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const WeeklyMeals = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("southindian");
  const [items, setItems] = useState([
    { label: "South Indian", value: "southindian" },
    { label: "North Indian", value: "northindian" },
  ]);

  return (
    <>
      <View className="flex-row justify-between items-center text-[12px]">
        <View className="w-40">
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            listMode="SCROLLVIEW"
            style={{
              borderRadius: 8,
              borderColor: "transparent",
              backgroundColor: "rgba(255, 118, 41, 0.1)",
              minHeight: 36,
              height: 36,
              paddingVertical: 0,
            }}
            dropDownContainerStyle={{
              borderColor: "transparent",
              borderRadius: 8,
              backgroundColor: "rgba(255, 118, 41, 0.1)",
            }}
            textStyle={{ fontSize: 12, color: "#FF7629" }}
          />
        </View>

        <TouchableOpacity
          className="flex-row items-center gap-1 bg-primary/10 rounded-lg"
          style={{ height: 36, paddingHorizontal: 8 }}
        >
          <Feather name="plus" size={16} color={"#FF7629"} />
          <Text className="text-primary font-medium text-[12px]">Add Meal</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default WeeklyMeals;
