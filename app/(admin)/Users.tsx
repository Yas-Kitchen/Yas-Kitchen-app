import IndividualUsers from "@/components/Admin/User/IndividualUsers";
import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ScrollView,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useAlert } from "@/context/AlertContext";
import { useUserAPI } from "@/hooks/useUserAPI";
import Skeleton from "@/components/common/Skeleton";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const Users = () => {
  const { showAlert } = useAlert();
  const { setPopupNames } = useGlobalContext();
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { getAllUsers, users, loading } = useUserAPI();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    showAlert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/");
        },
      },
    ]);
  };

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
          user.status?.toLowerCase().includes(query),
      );
    }

    if (selectedFilter !== "all") {
      result = result.filter(
        (user: any) =>
          user.status?.toLowerCase() === selectedFilter.toLowerCase() ||
          user.meal_type?.toLowerCase() === selectedFilter.toLowerCase(),
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
      <View
        style={{ paddingTop: insets.top + 20 }}
        className="font-poppins mx-5 gap-3"
      >
        {/* Header Skeleton */}
        <View className="font-poppins flex-row justify-between items-center mb-5">
          <Skeleton width={100} height={24} />
          <Skeleton width={60} height={16} />
        </View>

        {/* Search Bar Skeleton */}
        <View className="font-poppins flex-row justify-between gap-3 mb-5">
          <Skeleton width="70%" height={48} borderRadius={12} />
          <Skeleton width="25%" height={48} borderRadius={12} />
        </View>

        {/* User List Skeletons */}
        {[1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            className="font-poppins bg-white rounded-2xl p-4 gap-2 relative"
          >
            {/* Name */}
            <Skeleton width={120} height={16} style={{ marginBottom: 4 }} />
            {/* Number */}
            <Skeleton width={100} height={12} style={{ marginBottom: 8 }} />

            <View className="font-poppins flex-row gap-4">
              {/* Cuisine Badge */}
              <Skeleton width={60} height={24} borderRadius={20} />
              {/* Status Badge */}
              <Skeleton width={70} height={24} borderRadius={20} />
            </View>

            {/* Joined Date */}
            <Skeleton width={90} height={12} style={{ marginTop: 8 }} />

            {/* Action Buttons (Top Right) -> position absolute in skeleton too? or just visually similar place */}
            <View className="font-poppins absolute top-4 right-4 flex-row gap-2">
              <Skeleton width={50} height={24} />
              <Skeleton width={50} height={24} />
              <Skeleton width={50} height={24} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  const hasActiveFilters = searchQuery.trim() || selectedFilter !== "all";

  const renderHeader = () => (
    <View className="font-poppins  gap-3">
      <View className="font-poppins flex-row justify-between items-center">
        <Text className="font-poppins-semibold text-[16px] text-faded_black">
          Users
        </Text>
        <View className="font-poppins flex-row items-center gap-4">
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearFilters}>
              <Text className="text-primary text-xs font-poppins-semibold">
                Clear All
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleLogout}
            className="font-poppins bg-red-50 p-2 rounded-full"
          >
            <Feather name="log-out" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="font-poppins flex-row justify-between gap-3 mt-5">
        <View className="font-poppins flex-1 relative">
          <TextInput
            className="font-poppins p-4 pr-10 bg-white border !text-xs border-base_color/10 rounded-xl"
            placeholder="Search by name, phone, category..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ fontSize: 16 }}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="font-poppins absolute right-3 top-4"
            >
              <Feather name="x-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ) : (
            <View className="font-poppins absolute right-3 top-4">
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
                ? "text-white font-poppins-semibold"
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

      <View className="font-poppins flex-row justify-between items-center mb-5">
        <Text className="font-poppins text-xs text-base_color">
          Showing {filteredUsers.length} of {users.length} users
        </Text>
        <TouchableOpacity
          onPress={() => setPopupNames("adduser")}
          className="font-poppins p-3 bg-primary rounded-xl"
        >
          <Text className="font-poppins text-white text-xs">Add Users</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View className="font-poppins p-10 items-center bg-white rounded-2xl mt-5">
      <Feather name="inbox" size={48} color="#D1D5DB" />
      <Text className="text-faded_black text-center mt-3 font-poppins-semibold text-base">
        {hasActiveFilters ? "No users match your filters" : "No users found"}
      </Text>
      <Text className="font-poppins text-base_color text-center mt-2 text-xs">
        {hasActiveFilters
          ? "Try adjusting your search or filter criteria"
          : "Add users to get started"}
      </Text>
      {hasActiveFilters && (
        <TouchableOpacity
          onPress={clearFilters}
          className="font-poppins mt-4 px-6 py-3 bg-primary/10 rounded-xl"
        >
          <Text className="text-primary text-sm font-poppins-semibold">
            Clear Filters
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View
      style={{ paddingTop: insets.top + 20 }}
      className="font-poppins flex-1 mx-5"
    >
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IndividualUsers
            id={item.id}
            name={item.name}
            number={item.phone_number}
            category={item.cuisine_type_id}
            status={item.status}
            joindate={item.created_at}
            meal_plan_id={item.meal_plan_id}
            onStatusChange={getAllUsers}
            dietPlan={false}
            is_password_set={item.is_password_set}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      />

      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
          className="font-poppins flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="font-poppins bg-white rounded-t-3xl p-5"
          >
            <View className="font-poppins flex-row justify-between items-center mb-5">
              <Text className="text-lg font-poppins-bold">Filter Users</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView className="font-poppins max-h-96">
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
                  <View className="font-poppins flex-row items-center gap-3">
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
                          ? "font-poppins-semibold text-primary"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </View>

                  {selectedFilter === option.value && (
                    <View className="font-poppins bg-primary rounded-full p-1">
                      <Feather name="check" size={16} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              className="font-poppins mt-4 p-4 bg-primary rounded-xl"
            >
              <Text className="text-center font-poppins-semibold text-white">
                Apply Filter
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Users;
