import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import MealList, { MealListRef } from "./MealList";

const WeeklyMeals = () => {
  const [open, setOpen] = useState(false);
  const {
    selectedCategory,
    setSelectedCategory,
    categories,
    setCategories,
    setPopupNames,
  } = useGlobalContext();
  
  const mealListRef = useRef<MealListRef>(null);

  return (
    <>
      <View
        className="flex-row justify-between items-center text-[12px]"
        style={{ zIndex: 500 }}
      >
        <View className="flex-row gap-2">
          <View className="w-40" style={{ zIndex: 500 }}>
            <DropDownPicker
              open={open}
              value={selectedCategory}
              items={categories}
              setOpen={setOpen}
              setValue={(callback) => {
                const value = typeof callback === "function" ? callback(selectedCategory) : callback;
                setSelectedCategory(value);
              }}
              setItems={setCategories}
              listMode="SCROLLVIEW"
              placeholder="Select Category"
              placeholderStyle={{ color: "#999" }}
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
              disabled={categories.length === 0}
              disabledStyle={{ opacity: 0.5 }}
              renderListItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCategory(item.value ?? null);
                      setOpen(false);
                    }}
                    style={{ flex: 1 }}
                  >
                    <Text style={{ fontSize: 12, color: "#FF7629" }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      if (!item.value) return;

                      try {
                        const response = await fetch(
                          `${process.env.EXPO_PUBLIC_API_URL}/categories/${item.value}`,
                          {
                            method: "DELETE",
                          }
                        );

                        if (!response.ok) {
                          const errData = await response.json();
                          throw new Error(
                            errData.detail || "Failed to delete category"
                          );
                        }

                        setCategories((prev) =>
                          prev.filter((cat) => cat.value !== item.value)
                        );

                        if (selectedCategory === item.value)
                          setSelectedCategory(null);
                      } catch (error: any) {
                        alert(
                          error.message ||
                            "Something went wrong while deleting the category"
                        );
                      }
                    }}
                    style={{ padding: 4 }}
                  >
                    <Feather name="trash-2" size={16} color="#FF7629" />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          <TouchableOpacity
            onPress={() => setPopupNames("addcategory")}
            className="flex-row items-center gap-1 bg-primary/10 rounded-lg"
            style={{ height: 36, paddingHorizontal: 8 }}
          >
            <Feather name="folder-plus" size={16} color={"#FF7629"} />
            <Text className="text-primary font-medium text-[12px]">
              Add Category
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!selectedCategory) {
                alert("Please select a category first");
                return;
              }
              setPopupNames("addmeal");
            }}
            className="flex-row items-center gap-1 bg-primary/10 rounded-lg"
            style={{
              height: 36,
              paddingHorizontal: 8,
              opacity: !selectedCategory ? 0.5 : 1,
            }}
            disabled={!selectedCategory}
          >
            <Feather name="plus" size={16} color={"#FF7629"} />
            <Text className="text-primary font-medium text-[12px]">
              Add Meal
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-5">
        {categories.length === 0 ? (
          <View className="items-center justify-center mt-10">
            <Feather name="folder-plus" size={48} color="#ddd" />
            <Text className="text-gray-400 text-center mt-4 text-base">
              No categories yet
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              Create your first category to get started
            </Text>
          </View>
        ) : selectedCategory ? (
          <MealList ref={mealListRef} categoryId={selectedCategory} />
        ) : (
          <Text className="text-gray-400 text-center mt-10">
            Select a category to view meals
          </Text>
        )}
      </View>
    </>
  );
};

export default WeeklyMeals;
