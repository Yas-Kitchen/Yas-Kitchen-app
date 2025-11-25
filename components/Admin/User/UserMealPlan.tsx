import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalContext";
import { MealListProps } from "@/types/meals.types";
import ImageWithSkeleton from "@/components/shared/ImageWithSkeleton";

const UserMealPlan = ({
  loading,
  weeklyMenu,
  onDeleteMeal,
  userName,
}: MealListProps) => {
  const {
    setPopupNames,
    setSelectedMeal,
    setUserMealOpen,
    setSelectedUser,
    setSelectedDietUser,
  } = useGlobalContext();

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#FF7629" />
      </View>
    );
  }

  return (
    <>
      {userName && (
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => {
                setUserMealOpen(false);
                setSelectedUser(null);
                setSelectedDietUser(null);
              }}
              className="p-2 bg-gray-100 rounded-full"
            >
              <Feather name="arrow-left" size={20} color="#212529" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">{userName}'s Menu</Text>
          </View>
          <TouchableOpacity
            onPress={() => setPopupNames("createdietplan")}
            className="flex-row items-center gap-1 bg-primary/10 rounded-lg px-3 py-2"
          >
            <Feather name="plus" size={16} color={"#FF7629"} />
            <Text className="text-primary font-medium text-xs">Add Meal</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView className="gap-2 rounded-2xl">
        {Object.entries(weeklyMenu || {}).map(([day, dayMeals]) => {
          const lunch = dayMeals?.lunch ?? null;
          const dinner = dayMeals?.dinner ?? null;

          const hasMeals = lunch || dinner;

          return (
            <View
              key={day}
              className="bg-[#EFECE3] my-2 p-2 overflow-hidden rounded-xl relative"
            >
              <Text className="z-10 left-3 pb-1 text-primary font-medium text-xs">
                {day}
              </Text>

              {!hasMeals ? (
                <Text className="text-gray-400 px-3 mt-8 pb-4 text-xs">
                  No meals added for this day
                </Text>
              ) : (
                <View className="flex-col gap-3">
                  {["lunch", "dinner"].map((timeSlot) => {
                    const meal = dayMeals?.[timeSlot];

                    if (!meal) {
                      return (
                        <View key={timeSlot} className="flex-row p-3 mt-5">
                          <Text className="text-gray-400 text-xs">
                            No meal added for {timeSlot}
                          </Text>
                        </View>
                      );
                    }
                    return (
                      <View
                        key={meal.slot_id ?? timeSlot}
                        className="flex-row relative"
                      >
                        <ImageWithSkeleton
                          uri={meal.image}
                          containerClassName="h-40 w-44 max-h-40 max-w-44 mr-3 rounded-xl"
                          imageClassName="h-full w-full rounded-xl"
                        />
                        <Text className="text-primary text-xs font-medium absolute top-5 right-5">
                          {timeSlot}
                        </Text>
                        <View className="flex-col gap-3 justify-center flex-1">
                          <Text className="font-semibold text-sm">
                            {meal.name}
                          </Text>
                          {!!meal.description && (
                            <Text className="text-base_color text-xs w-[80%]">
                              {meal.description}
                            </Text>
                          )}
                          <View className="flex-row gap-2 mt-2">
                            <TouchableOpacity
                              onPress={() => {
                                setPopupNames("editmeal");
                                setSelectedMeal({
                                  mealId: meal.meal_id,
                                  mealPlanId: meal.mealPlanId,
                                  name: meal.name,
                                  description: meal.description,
                                  image: meal.image,
                                  day,
                                  timeSlot,
                                });
                              }}
                              className="flex-row gap-1 p-3 rounded-xl bg-[#F3F4F6] items-center"
                            >
                              <Feather
                                name="edit"
                                color={"#212529"}
                                size={15}
                              />
                              <Text className="text-sm">Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() =>
                                onDeleteMeal(meal.mealPlanId, meal.meal_id)
                              }
                              className="flex-row gap-1 p-3 items-center bg-primary/10 rounded-xl"
                            >
                              <Feather
                                name="trash"
                                size={15}
                                color={"#FF7629"}
                              />
                              <Text className="text-sm text-primary">
                                Delete
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

export default UserMealPlan;
