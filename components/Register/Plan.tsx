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
    if (!selectedPlan || selectedPlan.length === 0) {
      alert("Please choose at least one monthly plan to continue.");
      return;
    }

    if (isEditing) {
      await updatePlan(selectedPlan.map((p) => p.key.toLowerCase()));
      setActiveStep(3);
      return;
    }
    await selectPlan(selectedPlan.map((p) => p.key.toLowerCase()));
    setActiveStep(3);
  };

  return (
    <View className="font-poppins bg-white rounded-2xl mt-10 p-5 pt-8">
      <Text className="font-poppins text-base text-[12px]">
        Choose your monthly plan
      </Text>
      <MonthlyPlan />
      <View className="font-poppins flex-row gap-3 mr-3">
        <TouchableOpacity
          onPress={() => {
            setActiveStep(1);
          }}
          className="font-poppins bg-base_color/10 mt-5 p-5 w-1/2 rounded-2xl"
        >
          <Text className="font-poppins text-center text-black">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleContinue();
          }}
          className="font-poppins bg-primary mt-5 w-1/2 p-5 rounded-2xl"
        >
          <Text className="font-poppins text-center text-white">
            {loading ? "Loading..." : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Plan;
