import { View } from "react-native";
const MonthlyPlan = () => {
  const foodPlans = [
    {
      Regular: {
        name: "Regular Plan",
        description: "Daily meals delivered to your doorstep",
        price: 83,
      },
      Diet: {
        name: "Diet Plan",
        description: "Calorie-controlled meals for weight management",
        price: 100,
      },
      Kids: {
        name: "Kids Plan",
        description: "Nutritious meals specially designed for children",
      },
    },
  ];

  return (
    <View>
      <View></View>
    </View>
  );
};

export default MonthlyPlan;
