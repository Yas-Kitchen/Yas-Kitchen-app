import { useGlobalContext } from "@/context/GlobalContext";
import { Text, TouchableOpacity, View } from "react-native";
import MonthlyPlan from "./MonthlyPlan";
import { useRegisterAPI } from "@/hooks/useRegisterAPI";
const Plan = () => {
  const {
    setActiveStep,
    monthlyPlan: selectedPlan,
    isEditing,
  } = useGlobalContext();
  const { selectPlan, updatePlan, loading } = useRegisterAPI();
  const handleContinue = async () => {
    if (isEditing) {
      await updatePlan(selectedPlan.map((p) => p.key.toLowerCase()));
      setActiveStep(3);
      return;
    }
    if (selectedPlan.length > 0) {
      await selectPlan(selectedPlan.map((p) => p.key.toLowerCase()));
    }
    setActiveStep(3);
  };

  return (
    <View className="bg-white rounded-2xl mt-10 p-5 pt-8">
      <Text className="text-base text-[12px]">Choose your monthly plan</Text>
      <MonthlyPlan />
      <View className="flex-row gap-3 mr-3">
        <TouchableOpacity
          onPress={() => {
            setActiveStep(1);
          }}
          className="bg-base_color/10 mt-5 p-5 w-1/2 rounded-2xl"
        >
          <Text className="text-center text-black">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleContinue();
          }}
          className="bg-primary mt-5 w-1/2 p-5 rounded-2xl"
        >
          <Text className="text-center text-white">
            {loading ? "Loading..." : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Plan;
