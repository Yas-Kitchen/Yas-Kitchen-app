import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Users = () => {
  const {setPopupNames} = useGlobalContext()
  return (
    <ScrollView>
      <View className="ios:mt-16 mt-5 mx-5 gap-3">
        <Text className="font-semibold text-[16px] text-faded_black">
          Users
        </Text>
        <View className="flex-row justify-between gap-3 mt-5">
          <TextInput
            className="p-4 flex-1 bg-white border text-xs border-base_color/10 rounded-xl"
            placeholder="Search users.."
          />
          <TouchableOpacity className="flex-row items-center gap-1 p-2 rounded-xl bg-white border border-base_color/10">
            <Text className="text-center items-center text-xs">All Users</Text>
            <Feather name="filter" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-base_color">
            Showing 8 of 8 users
          </Text>
          <TouchableOpacity onPress={() => setPopupNames('adduser')} className="p-3 bg-primary rounded-xl">
              <Text className="text-white text-xs">Add Users</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Users;
