import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAlert } from "@/context/AlertContext";
import DropDownPicker from "react-native-dropdown-picker";
import MealList from "./MealList";
import { AggregatedWeeklyMenu, CategoryDropdown } from "@/types/meals.types";
import { useMealsAPI } from "@/hooks/useMealsAPI";

const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const getEmptyWeeklyMenu = (): AggregatedWeeklyMenu =>
  DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = {};
    return acc;
  }, {} as AggregatedWeeklyMenu);

const WeeklyMeals = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryDropdown[]>([]);
  const { showAlert } = useAlert();

  const {
    setPopupNames,
    selectedCategory,
    setSelectedCategory,
    mealListRef,
    setCurrentWeeklyMenu,
    cuisineRefreshKey,
    mealRefreshKey,
    setMealRefreshKey,
  } = useGlobalContext();
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
      fetchMeals("regular", selectedCategory);
    }
    // eslint-disable-next-line
  }, [selectedCategory, mealRefreshKey]);

  useEffect(() => {
    if (!mealListRef) return;

    mealListRef.current = {
      refresh: () => {
        if (selectedCategory) {
          setMealRefreshKey(Date.now());
        }
      },
    };

    return () => {
      if (mealListRef) {
        mealListRef.current = null;
      }
    };
    //eslint-disable-next-line
  }, [fetchMeals, mealListRef, selectedCategory]);

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
            })),
          );
        }
      } catch (error) {
        console.log("Failed to load cuisines", error);
      }
    };

    loadCuisines();
    //eslint-disable-next-line
  }, [cuisineRefreshKey]);

  const aggregatedWeeklyMenu = useMemo(() => {
    const base = getEmptyWeeklyMenu();

    if (!meals || meals.length === 0) {
      return base;
    }

    meals.forEach((plan) => {
      const menu = plan?.weekly_menu ?? {};
      Object.entries(menu).forEach(([dayKey, dayMeals]) => {
        const normalizedDay = dayKey.toLowerCase();
        if (!base[normalizedDay]) {
          base[normalizedDay] = {};
        }

        Object.entries(dayMeals ?? {}).forEach(([slotKey, meal]) => {
          if (!meal) return;
          base[normalizedDay][slotKey] = {
            ...meal,
            mealPlanId: plan.id,
          };
        });
      });
    });

    return base;
  }, [meals]);

  const hasAnyMeals = useMemo(() => {
    return Object.values(aggregatedWeeklyMenu).some(
      (dayMeals) => Object.keys(dayMeals).length > 0,
    );
  }, [aggregatedWeeklyMenu]);

  useEffect(() => {
    setCurrentWeeklyMenu(aggregatedWeeklyMenu);
  }, [aggregatedWeeklyMenu, setCurrentWeeklyMenu]);

  return (
    <>
      <View
        className="font-poppins flex-row justify-center items-center text-[12px]"
        style={{ zIndex: 5000 }}
      >
        <View className="font-poppins flex-row gap-2 items-center">
          <View className="font-poppins w-40" style={{ zIndex: 5000 }}>
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
              textStyle={{ fontSize: 10, color: "#FF7629" }}
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
                    <Text style={{ fontSize: 10, color: "#FF7629" }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (!item.value) return;
                      if (!item.value) return;
                      showAlert(
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
                                    })),
                                  );
                                }
                              }
                            },
                          },
                        ],
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
            className="font-poppins flex-row items-center gap-1 bg-primary/10 rounded-lg"
            style={{ height: 36, paddingHorizontal: 8 }}
          >
            <Feather name="folder-plus" size={16} color={"#FF7629"} />
            <Text className="text-primary font-poppins-medium text-[10px]">
              Add Category
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!selectedCategory) {
                showAlert("Error", "Please select a category first");
                return;
              }
              setPopupNames("addmeal");
            }}
            className="font-poppins flex-row items-center gap-1 bg-primary/10 rounded-lg"
            style={{
              height: 36,
              paddingHorizontal: 8,
              opacity: !selectedCategory ? 0.5 : 1,
            }}
            disabled={!selectedCategory}
          >
            <Feather name="plus" size={16} color={"#FF7629"} />
            <Text className="text-primary font-poppins-medium text-[10px]">
              Add Meal
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="font-poppins mt-5">
        {categories.length === 0 ? (
          loading ? (
            <Text className="font-poppins text-gray-400 text-center mt-10">
              Loading categories...
            </Text>
          ) : (
            <View className="font-poppins items-center justify-center mt-10">
              <Feather name="folder-plus" size={48} color="#ddd" />
              <Text className="font-poppins text-gray-400 text-center mt-4 text-base">
                No categories yet
              </Text>
              <Text className="font-poppins text-gray-400 text-center text-sm">
                Create your first category to get started
              </Text>
            </View>
          )
        ) : selectedCategory ? (
          hasAnyMeals || loading ? (
            <MealList
              weeklyMenu={aggregatedWeeklyMenu}
              loading={loading}
              onDeleteMeal={deleteMeals}
            />
          ) : (
            <Text className="font-poppins text-gray-400 text-center mt-10">
              No meals added for this cuisine yet
            </Text>
          )
        ) : (
          <Text className="font-poppins text-gray-400 text-center mt-10">
            Select a category to view meals
          </Text>
        )}
      </View>
    </>
  );
};

export default WeeklyMeals;
