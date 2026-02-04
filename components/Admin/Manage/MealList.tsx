import {
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useGlobalContext } from "@/context/GlobalContext";
import { MealListProps } from "@/types/meals.types";
import ImageWithSkeleton from "@/components/shared/ImageWithSkeleton";
import { TouchableOpacity } from "react-native";

const MealList = ({ loading, weeklyMenu, onDeleteMeal }: MealListProps) => {
  const { setPopupNames, setSelectedMeal } = useGlobalContext();

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#FF7629" />
      </View>
    );
  }

  return (
    <View className="font-poppins gap-2">
      {Object.entries(weeklyMenu || {}).map(([day, dayMeals]) => {
        const lunch = dayMeals?.lunch ?? null;
        const dinner = dayMeals?.dinner ?? null;

        const hasMeals = lunch || dinner;

        return (
          <View
            key={day}
            className="font-poppins bg-[#EFECE3] my-2 p-2 overflow-hidden rounded-xl relative"
          >
            <Text className="z-10 left-3 py-2 text-primary uppercase font-poppins text-[10px]">
              {day}
            </Text>

            {!hasMeals ? (
              <Text className="font-poppins text-gray-400 px-3 mt-8 pb-4 text-xs">
                No meals added for this day
              </Text>
            ) : (
              <View className="font-poppins flex-col gap-3">
                {["lunch", "dinner"].map((timeSlot) => {
                  const meal = dayMeals?.[timeSlot];

                  if (!meal) {
                    return (
                      <View key={timeSlot} className="font-poppins flex-row p-3 mt-5">
                        <Text className="text-gray-400 font-poppins text-xs">
                          No meal added for {timeSlot}
                        </Text>
                      </View>
                    );
                  }
                  return (
                    <View
                      key={meal.slot_id ?? timeSlot}
                      className="font-poppins flex-row relative"
                    >
                      <ImageWithSkeleton
                        uri={meal.image}
                        containerClassName="h-[120px] w-[130px] max-h-40 max-w-44 mr-3 rounded-xl"
                        imageClassName="h-full w-full rounded-xl"
                      />
                      <Text className="text-primary text-[10px] uppercase font-poppins absolute top-5 right-3">
                        {timeSlot}
                      </Text>
                      <View className="font-poppins flex-col gap-3 justify-center flex-1">
                        <Text className="font-poppins-medium text-xs">
                          {meal.name}
                        </Text>
                        {!!meal.description && (
                          <Text className="text-base_color text-[10px] font-poppins w-[80%]">
                            {meal.description}
                          </Text>
                        )}
                        <View className="font-poppins flex-row gap-2 mt-2">
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
                            className="font-poppins flex-row gap-1 p-3 rounded-xl bg-[#F3F4F6] items-center"
                          >
                            <Feather
                              name="edit"
                              color={"#212529"}
                              size={14}
                            />
                            <Text className="text-xs font-poppins">Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              onDeleteMeal(meal.mealPlanId, meal.meal_id)
                            }
                            className="font-poppins flex-row gap-1 p-3 items-center bg-primary/10 rounded-xl"
                          >
                            <Feather
                              name="trash"
                              size={14}
                              color={"#FF7629"}
                            />
                            <Text className="text-xs font-poppins text-primary">Delete</Text>
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
    </View>
  );
};

export default MealList;
