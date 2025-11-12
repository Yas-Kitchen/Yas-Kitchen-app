import IndividualUsers from "@/components/Admin/User/IndividualUsers";
import { useUserAPI } from "@/hooks/useUserAPI";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DietPlan = () => {
  const { getAllUsers, users } = useUserAPI();

  useEffect(() => {
    const getDietUses = async () => {
      await getAllUsers();
      console.log("Diet scheme : ",users);
    };
    getDietUses();
  }, []);

  const [filteredUsers, setFilteredUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      number: "9876543210",
      category: "North Indian",
      status: "active",
      joindate: "2025-10-01",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const userss = [
    {
      id: "1",
      name: "John Doe",
      number: "9876543210",
      category: "North Indian",
      status: "active",
      joindate: "2025-10-01",
    },
  ];

  const applyFilters = (query: string) => {
    let result = [...userss];

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerQuery) ||
          user.number.toLowerCase().includes(lowerQuery) ||
          user.category.toLowerCase().includes(lowerQuery) ||
          user.status.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredUsers(result);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredUsers(users);
  };

  const hasActiveFilters = searchQuery.trim();

  return (
    <ScrollView>
      <View className="gap-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-[17px] font-semibold">Add-ons</Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearSearch}>
              <Text className="text-primary text-xs font-semibold">
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row justify-between gap-3 mt-5">
          <View className="flex-1 relative">
            <TextInput
              className="p-4 pr-10 bg-white border text-xs border-base_color/10 rounded-xl"
              placeholder="Search by name, phone, category..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                applyFilters(text);
              }}
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  clearSearch();
                }}
                className="absolute right-3 top-4"
              >
                <Feather name="x-circle" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ) : (
              <View className="absolute right-3 top-4">
                <Feather name="search" size={16} color="#9CA3AF" />
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={() => {}}
            className="p-3 bg-primary rounded-xl items-center justify-center"
          >
            <Text className="text-white text-xs">Add Users</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-base_color">
            Showing {filteredUsers.length} of {users.length} users
          </Text>
        </View>

        {filteredUsers.length === 0 ? (
          <View className="p-10 items-center bg-white rounded-2xl mt-5">
            <Feather name="inbox" size={48} color="#D1D5DB" />
            <Text className="text-faded_black text-center mt-3 font-semibold text-base">
              {hasActiveFilters
                ? "No users match your filters"
                : "No users found"}
            </Text>
            <Text className="text-base_color text-center mt-2 text-xs">
              {hasActiveFilters
                ? "Try adjusting your search or filter criteria"
                : "Add users to get started"}
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity
                onPress={clearSearch}
                className="mt-4 px-6 py-3 bg-primary/10 rounded-xl"
              >
                <Text className="text-primary text-sm font-semibold">
                  Clear Filters
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredUsers.map((user) => (
            <IndividualUsers
              key={user.id}
              id={user.id}
              name={user.name}
              number={user.number}
              category={user.category}
              status={user.status}
              joindate={user.joindate}
              onStatusChange={() => {}}
              dietPlan={true}
            />
          ))
        )}
      </View>

      <View className="h-32" />
    </ScrollView>
  );
};

export default DietPlan;
