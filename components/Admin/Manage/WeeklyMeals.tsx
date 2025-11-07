import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import MealList from "./MealList";
import { useMealsAPI } from "@/hooks/useMealsAPI";
import { CategoryDropdown } from "@/types/meals.types";

const WeeklyMeals = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryDropdown[]>([]);

  const { setPopupNames, selectedCategory, setSelectedCategory, mealListRef } =
    useGlobalContext();
  const {
    fetchMeals,
    deleteCuisine,
    loading,
    fetchCuisineDetails,
    meals,
    deleteMeals,
  } = useMealsAPI();

  useEffect(() => {
    if (selectedCategory) {
      fetchMeals("Regular", selectedCategory);
    }
    // eslint-disable-next-line
  }, [selectedCategory]);

  useEffect(() => {
    const loadCuisines = async () => {
      try {
        const data = await fetchCuisineDetails();
        if (data && Array.isArray(data)) {
          setCategories(
            data.map((c: any) => ({
              id: c.id,
              label: c.name,
              value: c.id,
              name: c.name,
              is_active: c.is_active ?? true,
              created_at: c.created_at ?? "",
              updated_at: c.updated_at ?? "",
            }))
          );
        }
      } catch (error) {
        console.log("Failed to load cuisines", error);
      }
    };

    loadCuisines();
    //eslint-disable-next-line
  }, []);

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
                const value =
                  typeof callback === "function"
                    ? callback(selectedCategory)
                    : callback;
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
              disabled={categories.length === 0 || loading}
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
                    onPress={() => {
                      if (!item.value) return;
                      Alert.alert(
                        "Delete Category",
                        `Are you sure you want to delete "${item.label}"?`,
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: async () => {
                              if (item.value) {
                                await deleteCuisine(item.value);
                                const updated = await fetchCuisineDetails();
                                if (updated && Array.isArray(updated)) {
                                  setCategories(
                                    updated.map((c: any) => ({
                                      id: c.id,
                                      label: c.name,
                                      value: c.id,
                                      name: c.name,
                                      is_active: c.is_active ?? true,
                                      created_at: c.created_at ?? "",
                                      updated_at: c.updated_at ?? "",
                                    }))
                                  );
                                }
                              }
                            },
                          },
                        ]
                      );
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
                Alert.alert("Error", "Please select a category first");
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
        {loading ? (
          <Text className="text-gray-400 text-center mt-10">
            Loading categories...
          </Text>
        ) : categories.length === 0 ? (
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
          <MealList
            meals={meals}
            loading={loading}
            onDeleteMeal={deleteMeals}
            ref={mealListRef}
          />
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
