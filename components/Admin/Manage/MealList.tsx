import { useEffect, forwardRef } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalContext";
import { useMeals } from "@/hooks/useMealsAPI";

interface MealListProps {
  categoryId: string;
}

export interface MealListRef {
  refresh: () => void;
}

const MealList = forwardRef<MealListRef, MealListProps>(
  ({ categoryId }, ref) => {
    const { setPopupNames, setSelectedMeal } = useGlobalContext();
    const { meals, loading, fetchMeals, deleteMeals } = useMeals();

    useEffect(() => {
      fetchMeals(categoryId);
      //eslint-disable-next-line
    }, [categoryId]);

    if (loading) {
      return (
        <View>
          <ActivityIndicator size="large" color="#FF7629" />
        </View>
      );
    }

    return (
      <ScrollView className="gap-2">
        {Object.entries(meals || {}).map(([day, dayMeals]: any) => (
          <View
            key={day}
            className="bg-[#EFECE3] p-2 overflow-hidden rounded-xl relative"
          >
            <Text className="absolute top-5 z-10 left-3 text-primary font-medium text-xs">
              {day}
            </Text>
            <View className="flex-col gap-3">
              {["lunch", "dinner"].map((timeSloat) => {
                const meal = dayMeals[timeSloat];
                if (!meal) return null;
                return (
                  <View key={meal.id} className="flex-row relative">
                    <Image
                      className="h-40 w-44 max-h-40 max-w-44"
                      source={require("/Users/adithyakirancb/CodeVault/Freelance/YAS Kitchen/Frontend/assets/User/ricewithchicken.png")}
                    />
                    <Text className="text-primary text-xs font-medium absolute top-5 right-5">
                      {timeSloat}
                    </Text>
                    <View className="flex-col gap-3 justify-center">
                      <Text className="font-semibold text-sm">{meal.name}</Text>
                      <Text className="text-base_color text-xs w-[80%]">
                        {meal.description}
                      </Text>
                      <View className="flex-row gap-2">
                        <TouchableOpacity
                          onPress={() => {
                            setPopupNames("editmeal")
                            setSelectedMeal(meal.mealPlanId)
                          }}
                          className="flex-row gap-1 p-3 rounded-xl bg-[#F3F4F6] items-center"
                        >
                          <Feather name="edit" color={"#212529"} size={15} />
                          <Text className="text-sm">Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => deleteMeals(meal.mealPlanId, meal.id)}
                          className="flex-row gap-1 p-3 items-center bg-primary/10 rounded-xl"
                        >
                          <Feather name="trash" size={15} color={"#FF7629"} />
                          <Text className="text-sm text-primary">Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }
);

MealList.displayName = "MealList";
export default MealList;
