import IndividualUsers from "@/components/Admin/User/IndividualUsers";
import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import { storage } from "@/services/storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Users = () => {
  const { setPopupNames } = useGlobalContext();
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await storage.getTokens();
      console.log("Token" ,token);
      
      const data = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/users/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(data.data);
    };
    fetchUsers();
  }, []);
  return (
    <ScrollView>
      <View className="mt-16 mx-5 gap-3">
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
          <Text className="text-xs text-base_color">Showing 8 of 8 users</Text>
          <TouchableOpacity
            onPress={() => setPopupNames("adduser")}
            className="p-3 bg-primary rounded-xl"
          >
            <Text className="text-white text-xs">Add Users</Text>
          </TouchableOpacity>
        </View>
        {users.map((user: any) => (
          <IndividualUsers
            key={user.id}
            name={user.name}
            number={user.phone_number}
            category={user.meal_type}
            status={user.status}
            joindate={user.created_at}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default Users;
