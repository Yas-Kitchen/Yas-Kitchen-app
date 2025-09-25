import Greetings from "@/components/User/Home/Greetings";
import TodaysMeal from "@/components/User/Home/TodaysMeal";
import { useMockMenu } from "@/hooks/use-MockMenu";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const Home = () => {
  const menu = useMockMenu();
  const currentDate = new Date();
  const weekName = currentDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase() as keyof typeof menu.menu;
  const todaysMenu = menu.menu[weekName];
  return (
    <ScrollView>
      <View className="mt-16 mx-5">
        <Greetings />
        <View className="mt-8 gap-5">
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
      </View>
      <View className="h-32" />
    </ScrollView>
  );
};

export default Home;
