import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalContext";

interface Meal {
  id: string;
  name: string;
  description: string;
  image_url: string;
  day: string;
  time: string;
  rating: number;
  cuisine_type: string;
}

interface MealListProps {
  categoryId: string;
}

export interface MealListRef {
  refresh: () => void;
}

const MealList = forwardRef<MealListRef, MealListProps>(
  ({ categoryId }, ref) => {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const { setPopupNames, setSelectedMeal } = useGlobalContext();

    useEffect(() => {
      fetchMeals();
    }, [categoryId]);

    const fetchMeals = async () => {
      setLoading(true);
      try {
        console.log("Fetching meals for category:", categoryId);

        const { data, error } = await supabase
          .from("meals")
          .select("*")
          .eq("cuisine_type", categoryId)
          .order("day", { ascending: true });

        if (error) {
          console.error("Error fetching meals:", error);
          return;
        }

        console.log("Fetched meals:", data);
        setMeals(data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      refresh: fetchMeals,
    }));

    const handleDelete = async (mealId: string, mealName: string) => {
      Alert.alert(
        "Delete Meal",
        `Are you sure you want to delete "${mealName}"?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                const { error } = await supabase
                  .from("meals")
                  .delete()
                  .eq("id", mealId);

                if (error) {
                  console.error("Delete error:", error);
                  Alert.alert("Error", "Failed to delete meal");
                  return;
                }

                // Refresh the list
                await fetchMeals();
                Alert.alert("Success", "Meal deleted successfully");
              } catch (error) {
                console.error("Error:", error);
                Alert.alert("Error", "Something went wrong");
              }
            },
          },
        ]
      );
    };

    const handleEdit = (meal: Meal) => {
      console.log("Editing meal:", meal); // ✅ Debug log
      setSelectedMeal(meal); // ✅ Store the meal data
      setPopupNames("editmeal");
    };

    const mealsByDay = meals.reduce((acc, meal) => {
      const day = meal.day.charAt(0).toUpperCase() + meal.day.slice(1);
      if (!acc[day]) {
        acc[day] = {};
      }
      acc[day][meal.time] = meal;
      return acc;
    }, {} as Record<string, Record<string, Meal>>);

    if (loading) {
      return (
        <View className="items-center justify-center mt-10">
          <ActivityIndicator size="large" color="#FF7629" />
        </View>
      );
    }

    if (meals.length === 0) {
      return (
        <View className="items-center justify-center mt-10">
          <Text className="text-gray-400 text-center text-base">
            No meals yet
          </Text>
          <Text className="text-gray-400 text-center text-sm mt-2">
            Click Add Meal to add your first meal
          </Text>
        </View>
      );
    }

    return (
      <>
        {Object.entries(mealsByDay).map(([day, meals]) => (
          <View key={day} className="mb-6 bg-[#EFECE3] rounded-2xl p-5">
            <Text className="text-primary font-semibold mb-3 capitalize">
              {day}
            </Text>

            {Object.entries(meals).map(([mealType, dish]) => (
              <View key={dish.id} className="mb-4">
                <View className="flex-row">
                  {dish.image_url ? (
                    <Image
                      source={{ uri: dish.image_url }}
                      className="w-40 h-40 max-w-40 max-h-40 rounded-lg mr-3"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-40 h-40 max-w-40 max-h-40 rounded-lg mr-3 bg-gray-200 items-center justify-center">
                      <Feather name="image" size={40} color="#999" />
                    </View>
                  )}

                  <View className="flex-1">
                    <View className="flex-row justify-between">
                      <Text className="font-semibold text-sm">{dish.name}</Text>
                      <Text className="text-primary font-medium text-xs capitalize">
                        {mealType}
                      </Text>
                    </View>
                    <Text className="text-base_color text-xs w-[60%]">
                      {dish.description}
                    </Text>

                    <View className="flex-row mt-2">
                      <TouchableOpacity
                        onPress={() => setPopupNames("editmeal")}
                        className="bg-white flex-row items-center gap-1 px-3 py-1 rounded-lg mr-2"
                      >
                        <Feather name="edit" size={16} />
                        <Text className="text-sm">Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDelete(dish.id, dish.name)}
                        className="bg-primary/10 flex-row gap-1 items-center px-3 py-1 rounded-lg"
                      >
                        <Feather name="trash" size={16} color={"#FF7629"} />
                        <Text className="text-primary text-sm">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </>
    );
  }
);

MealList.displayName = "MealList";

export default MealList;
