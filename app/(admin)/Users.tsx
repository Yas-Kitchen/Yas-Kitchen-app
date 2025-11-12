import IndividualUsers from "@/components/Admin/User/IndividualUsers";
import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useUserAPI } from "@/hooks/useUserAPI";

const Users = () => {
  const { setPopupNames } = useGlobalContext();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { getAllUsers, users, loading } = useUserAPI();

  const filterOptions = [
    { value: "all", label: "All Users", icon: "users" },
    { value: "active", label: "Active", icon: "check-circle" },
    { value: "pending", label: "Pending", icon: "clock" },
    { value: "paused", label: "Paused", icon: "pause-circle" },
    { value: "north_indian", label: "North Indian", icon: "sun" },
    { value: "south_indian", label: "South Indian", icon: "coffee" },
  ];

  useEffect(() => {
    getAllUsers();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    applyFilters();
    //eslint-disable-next-line
  }, [searchQuery, selectedFilter, users]);

  const applyFilters = () => {
    let result = [...users];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user: any) =>
          user.name?.toLowerCase().includes(query) ||
          user.phone_number?.toLowerCase().includes(query) ||
          user.meal_type?.toLowerCase().includes(query) ||
          user.status?.toLowerCase().includes(query)
      );
    }

    if (selectedFilter !== "all") {
      result = result.filter(
        (user: any) =>
          user.status?.toLowerCase() === selectedFilter.toLowerCase() ||
          user.meal_type?.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    setFilteredUsers(result);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedFilter("all");
  };

  const getFilterLabel = () => {
    const option = filterOptions.find((opt) => opt.value === selectedFilter);
    return option?.label || "All Users";
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF7629" />
        <Text className="mt-3 text-base_color">Loading users...</Text>
      </View>
    );
  }

  const hasActiveFilters = searchQuery.trim() || selectedFilter !== "all";
console.log(users);


  return (
    <ScrollView>
      <View className="mt-16 mx-5 gap-3">
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-[16px] text-faded_black">
            Users
          </Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearFilters}>
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
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
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
            onPress={() => setShowFilterModal(true)}
            className={`flex-row items-center gap-1 p-2 px-3 rounded-xl border ${
              selectedFilter !== "all"
                ? "bg-primary border-primary"
                : "bg-white border-base_color/10"
            }`}
          >
            <Text
              className={`text-center text-xs ${
                selectedFilter !== "all"
                  ? "text-white font-semibold"
                  : "text-black"
              }`}
            >
              {getFilterLabel()}
            </Text>
            <Feather
              name="filter"
              size={14}
              color={selectedFilter !== "all" ? "#FFF" : "#000"}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-base_color">
            Showing {filteredUsers.length} of {users.length} users
          </Text>
          <TouchableOpacity
            onPress={() => setPopupNames("adduser")}
            className="p-3 bg-primary rounded-xl"
          >
            <Text className="text-white text-xs">Add Users</Text>
          </TouchableOpacity>
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
                onPress={clearFilters}
                className="mt-4 px-6 py-3 bg-primary/10 rounded-xl"
              >
                <Text className="text-primary text-sm font-semibold">
                  Clear Filters
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredUsers.map((user: any) => (
            <IndividualUsers
              key={user.id}
              id={user.id}
              name={user.name}
              number={user.phone_number}
              category={user.cuisine_type_id}
              status={user.status}
              joindate={user.created_at}
              meal_plan_id={user.meal_plan_id}
              onStatusChange={getAllUsers}
              dietPlan={false}
            />
          ))
        )}
      </View>

      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-white rounded-t-3xl p-5"
          >
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-lg font-bold">Filter Users</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-96">
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleFilterSelect(option.value)}
                  className={`flex-row items-center justify-between p-4 mb-2 rounded-xl ${
                    selectedFilter === option.value
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-gray-50"
                  }`}
                >
                  <View className="flex-row items-center gap-3">
                    <Feather
                      name={option.icon as any}
                      size={20}
                      color={
                        selectedFilter === option.value ? "#FF7629" : "#6B7280"
                      }
                    />
                    <Text
                      className={`text-base ${
                        selectedFilter === option.value
                          ? "font-semibold text-primary"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </View>

                  {selectedFilter === option.value && (
                    <View className="bg-primary rounded-full p-1">
                      <Feather name="check" size={16} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              className="mt-4 p-4 bg-primary rounded-xl"
            >
              <Text className="text-center font-semibold text-white">
                Apply Filter
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <View className="h-32" />
    </ScrollView>
  );
};

export default Users;
