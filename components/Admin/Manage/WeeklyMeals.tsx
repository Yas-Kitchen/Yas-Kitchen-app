import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import NorthIndian from "./NorthIndian";
import SouthIndian from "./SouthIndian";

const WeeklyMeals = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("southindian");
  const [items, setItems] = useState([
    { label: "South Indian", value: "southindian" },
    { label: "North Indian", value: "northindian" },
  ]);
  const { setPopupNames } = useGlobalContext();

  return (
    <>
      <View
        className="flex-row justify-between items-center text-[12px]"
        style={{ zIndex: 500 }}
      >
        <View className="w-40" style={{ zIndex: 500 }}>
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
              backgroundColor: "white",
            }}
            textStyle={{ fontSize: 12, color: "#FF7629" }}
          />
        </View>

        <TouchableOpacity
          onPress={() => setPopupNames("addmeal")}
          className="flex-row items-center gap-1 bg-primary/10 rounded-lg"
          style={{ height: 36, paddingHorizontal: 8 }}
        >
          <Feather name="plus" size={16} color={"#FF7629"} />
          <Text className="text-primary font-medium text-[12px]">Add Meal</Text>
        </TouchableOpacity>
      </View>
      <View className="mt-5">
        {value === "southindian" ? <SouthIndian /> : <NorthIndian />}
      </View>
    </>
  );
};

export default WeeklyMeals;
