import Greetings from "@/components/User/Home/Greetings";
import TodaysMeal from "@/components/User/Home/TodaysMeal";
import WeeklyPlan from "@/components/User/Home/WeeklyPlan";
import { useGlobalContext } from "@/context/GlobalContext";
import { useMockMenu } from "@/hooks/use-MockMenu";
import { useUserAPI } from "@/hooks/useUserAPI";
import { getCuisineNameByID } from "@/utils/cuisine.util";
import { Feather } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";

const Home = () => {
  const menu = useMockMenu();
  const { fetchUserData, user, loading } = useUserAPI();
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
  const todaysMenu = menu.southindian[weekName];

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
      }
    };
    loadUser();
    //eslint-disable-next-line
  }, [user]);

  return (
    <ScrollView>
      <View className="ios:mt-16 mt-5 mx-5 gap-8">
        <Greetings loading={loading} />
        <View className="gap-5">
          <Text className="font-semibold text-[17px] text-faded_black">
            Today&apos;s Meal&apos;s
          </Text>
          <TodaysMeal
            name={todaysMenu.lunch.name}
            description={todaysMenu.lunch.description}
            rating={todaysMenu.lunch.rating}
            availability={todaysMenu.lunch.availability}
            lunch={true}
            image={todaysMenu.lunch.image}
          />
          <TodaysMeal
            name={todaysMenu.dinner.name}
            description={todaysMenu.dinner.description}
            rating={todaysMenu.dinner.rating}
            availability={todaysMenu.dinner.availability}
            lunch={false}
            image={todaysMenu.dinner.image}
          />
        </View>
        <View className="gap-3">
          <View className="flex-row justify-between">
            <Text className="font-semibold text-[17px] text-faded_black">
              This Week
            </Text>
            <View className="flex-row items-center">
              <Text className="text-primary text-[12px font-medium]">
                Full plan
              </Text>
              <Feather name="chevron-right" color={"#FF7629"} size={15} />
            </View>
          </View>
          <WeeklyPlan />
        </View>
      </View>
      <View className="h-32" />
    </ScrollView>
  );
};

export default Home;
