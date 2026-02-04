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
import IndividualDietUsers from "../User/IndividualDietUsers";
import UserMealPlan from "../User/UserMealPlan";
import { useDietPlanAPI } from "@/hooks/useDietPlanAPI";
import { useGlobalContext } from "@/context/GlobalContext";

const DietPlan = () => {
  const {
    listDietUsers,
    dietUsers,
    getUserDietPlan,
    userDietPlan,
    updateDietPlan,
    loading: mealPlanLoading,
  } = useDietPlanAPI();
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [weeklyMenu, setWeeklyMenu] = useState<any>({});

  const {
    setPopupNames,
    userMealOpen,
    setUserMealOpen,
    selectedUser,
    setSelectedUser,
    setSelectedDietUser,
    mealRefreshKey,
    setMealRefreshKey,
  } = useGlobalContext();

  useEffect(() => {
    const getDietUser = async () => {
      await listDietUsers();
    };
    getDietUser();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      getUserDietPlan(selectedUser.id);
    }
  }, [selectedUser, mealRefreshKey]);

  useEffect(() => {
    if (userDietPlan?.weekly_menu) {
      setWeeklyMenu(userDietPlan.weekly_menu);
    } else {
      setWeeklyMenu({});
    }
  }, [userDietPlan]);

  const handleDeleteMeal = async (mealPlanId: string, mealId: string) => {
    if (!userDietPlan || !userDietPlan.weekly_menu) return;

    const updatedWeeklyMenu = JSON.parse(
      JSON.stringify(userDietPlan.weekly_menu)
    );
    let found = false;
    for (const day in updatedWeeklyMenu) {
      const dayMeals = updatedWeeklyMenu[day];
      for (const time in dayMeals) {
        if (dayMeals[time].mealPlanId === mealPlanId) {
          delete dayMeals[time];
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (found) {
      try {
        await updateDietPlan(selectedUser.id, {
          weekly_menu: updatedWeeklyMenu,
        });
        setMealRefreshKey(Date.now());
      } catch (error) {
        console.error("Failed to delete meal", error);
      }
    }
  };

  useEffect(() => {
    const DietUsers = dietUsers.filter((u) => u.has_diet_plan === true);

    if (!searchQuery.trim()) {
      setFilteredUsers(DietUsers);
      return;
    }

    const lower = searchQuery.toLowerCase();
    const searched = DietUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(lower) ||
        u.phone_number?.toLowerCase().includes(lower)
    );

    setFilteredUsers(searched);
  }, [searchQuery, dietUsers]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const hasActiveFilters = searchQuery.trim();

  if (userMealOpen && selectedUser) {
    return (
      <View className="font-poppins flex-1 ">
        <View className="font-poppins flex-1 p-4">
          {!userDietPlan && !mealPlanLoading ? (
            <View className="font-poppins flex-1 items-center justify-center p-8">
              <View className="font-poppins p-6 rounded-2xl items-center w-full">
                <Text className="text-lg font-poppins-semibold mt-4 text-center">
                  No Diet Plan Found
                </Text>
                <Text className="font-poppins text-base_color text-sm mt-2 text-center">
                  This user doesn't have a personalized diet plan yet.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setPopupNames("createdietplan");
                    setSelectedUser(selectedUser);
                    setSelectedDietUser(selectedUser);
                  }}
                  className="font-poppins mt-6 bg-primary px-6 py-3 rounded-xl flex-row items-center gap-2"
                >
                  <Feather name="plus" size={20} color="#FFFFFF" />
                  <Text className="text-white font-poppins-semibold">
                    Create Diet Plan
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <UserMealPlan
              loading={mealPlanLoading}
              weeklyMenu={weeklyMenu}
              onDeleteMeal={handleDeleteMeal}
              userName={selectedUser.name}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <ScrollView>
      <View className="font-poppins gap-3">
        <View className="font-poppins flex-row justify-between items-center">
          <Text className="text-[17px] font-poppins-semibold">Diet Plan</Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearSearch}>
              <Text className="text-primary text-xs font-poppins-semibold">
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="font-poppins flex-row justify-between gap-3 mt-1">
          <View className="font-poppins flex-1 relative">
            <TextInput
              className="font-poppins p-4 pr-10 bg-white border text-xs border-base_color/10 rounded-xl"
              placeholder="Search by name, phone, category..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
              }}
              style={{ fontSize: 16 }}
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  clearSearch();
                }}
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
            onPress={() => { }}
            className="font-poppins p-3 bg-primary rounded-xl items-center justify-center"
          >
            <Text className="font-poppins text-white text-xs">Add Users</Text>
          </TouchableOpacity>
        </View>

        <View className="font-poppins flex-row justify-between items-center">
          <Text className="font-poppins text-xs text-base_color">
            Showing {filteredUsers.length} of {dietUsers.length} users
          </Text>
        </View>

        {filteredUsers.length === 0 ? (
          <View className="font-poppins p-10 items-center bg-white rounded-2xl mt-5">
            <Feather name="inbox" size={48} color="#D1D5DB" />
            <Text className="text-faded_black text-center mt-3 font-poppins-semibold text-base">
              {hasActiveFilters
                ? "No users match your filters"
                : "No users found"}
            </Text>
            <Text className="font-poppins text-base_color text-center mt-2 text-xs">
              {hasActiveFilters
                ? "Try adjusting your search or filter criteria"
                : "Add users to get started"}
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity
                onPress={clearSearch}
                className="font-poppins mt-4 px-6 py-3 bg-primary/10 rounded-xl"
              >
                <Text className="text-primary text-sm font-poppins-semibold">
                  Clear Filters
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredUsers.map((user) => (
            <IndividualDietUsers
              key={user.id}
              id={user.id}
              name={user.name}
              number={user.phone_number}
              category={user.category}
              status={user.status}
              joindate={user.created_at}
              onStatusChange={() => { }}
              onPress={() => {
                setSelectedUser(user);
                setSelectedDietUser(user);
                setUserMealOpen(true);
              }}
            />
          ))
        )}
      </View>

      <View className="font-poppins h-32" />
    </ScrollView>
  );
};

export default DietPlan;
