import Greetings from "@/components/User/Home/Greetings";
import TodaysMeal from "@/components/User/Home/TodaysMeal";
import WeeklyPlan from "@/components/User/Home/WeeklyPlan";
import { useGlobalContext } from "@/context/GlobalContext";
import { useMockMenu } from "@/hooks/use-MockMenu";
import { useUserAPI } from "@/hooks/useUserAPI";
import { useDietPlanAPI } from "@/hooks/useDietPlanAPI";
import { getCuisineNameByID } from "@/utils/cuisine.util";
import { Feather } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import MealSkeleton from "@/components/User/Home/MealSkeleton";
import WeeklyPlanSkeleton from "@/components/User/Home/WeeklyPlanSkeleton";
import Skeleton from "@/components/common/Skeleton";

const Home = () => {
  const menu = useMockMenu();
  const { fetchUserData, user, loading: userLoading } = useUserAPI();
  const {
    getUserDietPlan,
    userDietPlan,
    loading: dietLoading,
  } = useDietPlanAPI();
  const loading = userLoading || dietLoading;
  const {
    setName,
    setAddress,
    setHasDietPlan,
    setHasKidsPlan,
    setHasRegularPlan,
    setFoodStyle,
    setMobile,
    setUserProfile,
  } = useGlobalContext();

  const currentDate = new Date();
  const weekName = currentDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as keyof typeof menu.southindian;

  // Use diet plan data if it exists for this user, otherwise fallback to mock menu
  const getTodaysMeals = () => {
    if (user?.has_diet_plan) {
      if (userDietPlan?.weekly_menu) {
        const todayDiet = userDietPlan.weekly_menu[weekName] || {};
        return {
          lunch: todayDiet.lunch || null,
          dinner: todayDiet.dinner || null,
        };
      }
      return { lunch: null, dinner: null }; // No mock data for diet users
    }
    return menu.southindian[weekName];
  };

  const todaysMenu = getTodaysMeals();

  useEffect(() => {
    fetchUserData();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      if (user) {
        setAddress(user.address);
        setName(user.name);
        setMobile(user.phone_number);
        const foodStyle = await getCuisineNameByID(user.cuisine_type_id);
        setFoodStyle(foodStyle);
        setUserProfile(user.profile_image_url);
        setHasDietPlan(user.has_diet_plan);
        setHasRegularPlan(user.has_regular_plan);
        setHasKidsPlan(user.has_kids_plan);

        if (user.has_diet_plan) {
          getUserDietPlan(user.id);
        }
      }
    };
    loadUser();
    //eslint-disable-next-line
  }, [user]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="font-poppins ios:mt-16 mt-5 mx-5 gap-8">
        <Greetings loading={loading} />
        <View className="font-poppins gap-5">
          <Text className="font-poppins-semibold text-[17px] text-faded_black">
            Today&apos;s Meal&apos;s
          </Text>
          {loading ? (
            <>
              <MealSkeleton />
              <MealSkeleton />
            </>
          ) : (
            <>
              {todaysMenu.lunch ? (
                <TodaysMeal
                  name={todaysMenu.lunch.name}
                  description={todaysMenu.lunch.description || ""}
                  rating={todaysMenu.lunch.rating || 0}
                  availability={todaysMenu.lunch.availability || "available"}
                  lunch={true}
                  image={todaysMenu.lunch.image}
                  mealPlanId={user?.meal_plan_id || userDietPlan?.id}
                  day={weekName}
                  userId={user?.id}
                />
              ) : (
                <View className="font-poppins border-2 bg-[#F1EFE8] border-primary rounded-2xl items-center p-6 mb-4">
                  <Text className="font-poppins-medium text-base_color">
                    No lunch scheduled for today
                  </Text>
                </View>
              )}
              {todaysMenu.dinner ? (
                <TodaysMeal
                  name={todaysMenu.dinner.name}
                  description={todaysMenu.dinner.description || ""}
                  rating={todaysMenu.dinner.rating || 0}
                  availability={todaysMenu.dinner.availability || "available"}
                  lunch={false}
                  image={todaysMenu.dinner.image}
                  mealPlanId={user?.meal_plan_id || userDietPlan?.id}
                  day={weekName}
                  userId={user?.id}
                />
              ) : (
                <View className="font-poppins border-2 bg-[#F1EFE8] border-primary rounded-2xl items-center p-6">
                  <Text className="font-poppins-medium text-base_color">
                    No dinner scheduled for today
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
        <View className="font-poppins gap-3">
          <View className="font-poppins flex-row justify-between">
            <Text className="font-poppins-semibold text-[17px] text-faded_black">
              This Week
            </Text>
            {loading ? (
              <Skeleton width={60} height={16} />
            ) : (
              <View className="font-poppins flex-row items-center">
                <Text className="text-primary text-[12px font-poppins-medium]">
                  Full plan
                </Text>
                <Feather name="chevron-right" color={"#FF7629"} size={15} />
              </View>
            )}
          </View>
          {loading ? <WeeklyPlanSkeleton /> : <WeeklyPlan />}
        </View>
      </View>
      <View className="font-poppins h-32" />
    </ScrollView>
  );
};

export default Home;
