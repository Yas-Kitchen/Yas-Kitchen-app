import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useUserAPI } from "@/hooks/useUserAPI";
import { UserTypes } from "@/types/user.types";
import { useGlobalContext } from "@/context/GlobalContext";

interface IndividualDietUsersProps extends UserTypes {
  onPress: () => void;
}

const IndividualDietUsers = ({
  id,
  name,
  number,
  status,
  joindate,
  onStatusChange,
  onPress,
}: IndividualDietUsersProps) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const { loading, updateUserStatus } = useUserAPI();
  const { setSelectedDietUser } = useGlobalContext();

  const isAdminAccount = name.toLocaleLowerCase() === "admin";

  const statusOptions = [
    { value: "active", label: "Active", color: "#16A34A", bg: "#DCFCE7" },
    { value: "pending", label: "Pending", color: "#CA8A04", bg: "#FEF9C3" },
    { value: "paused", label: "Paused", color: "#DC2626", bg: "#FEE2E2" },
  ];

  const handleStatusChange = async (newStatus: string) => {
    setShowStatusMenu(false);

    if (newStatus === currentStatus.toLowerCase()) {
      return;
    }

    await updateUserStatus(id!, newStatus);
    setCurrentStatus(newStatus);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusDisplay = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const getStatusStyle = (statusValue: string) => {
    const option = statusOptions.find(
      (opt) => opt.value === statusValue.toLowerCase()
    );
    return option || statusOptions[0];
  };

  const currentStatusStyle = getStatusStyle(currentStatus);

  return (
    <TouchableOpacity
      onPress={() => {
        setSelectedDietUser(id);
        onPress();
      }}
    >
      <View className="bg-white relative rounded-2xl p-4 gap-2">
        {loading && (
          <View className="absolute inset-0 bg-black/10 rounded-2xl z-50 justify-center items-center">
            <ActivityIndicator size="large" color="#FF7629" />
          </View>
        )}

        <Text
          className={`text-sm ${
            isAdminAccount && "text-primary font-bold"
          } font-semibold`}
        >
          {name}
        </Text>
        <Text className="text-base_color text-xs">{number}</Text>

        <View className="flex-row items-center gap-4">
          {!isAdminAccount && (
            <TouchableOpacity
              onPress={() => setShowStatusMenu(true)}
              className="p-2 rounded-full text-[10px] flex-row items-center gap-1"
              style={{ backgroundColor: currentStatusStyle.bg }}
            >
              <Text style={{ color: currentStatusStyle.color, fontSize: 10 }}>
                {getStatusDisplay(currentStatus)}
              </Text>
              <Feather
                name="chevron-down"
                size={12}
                color={currentStatusStyle.color}
              />
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-base_color text-[10px]">
          Joined: {formatDate(joindate)}
        </Text>
        <View className="absolute top-[50%] right-5">
          <Feather color={"#212529"} size={22} name="chevron-right" />
        </View>

        <Modal
          visible={showStatusMenu}
          transparent
          animationType="fade"
          onRequestClose={() => setShowStatusMenu(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowStatusMenu(false)}
            className="flex-1 bg-black/50 justify-center items-center"
          >
            <View className="bg-white rounded-2xl p-4 w-4/5 max-w-sm">
              <Text className="text-lg font-semibold mb-4">Change Status</Text>

              {statusOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleStatusChange(option.value)}
                  className="flex-row items-center justify-between p-4 border-b border-gray-100"
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: option.color }}
                    />
                    <Text className="text-base">{option.label}</Text>
                  </View>

                  {currentStatus.toLowerCase() === option.value && (
                    <Feather name="check" size={20} color={option.color} />
                  )}
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => setShowStatusMenu(false)}
                className="mt-4 p-4 bg-gray-100 rounded-xl"
              >
                <Text className="text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </TouchableOpacity>
  );
};

export default IndividualDietUsers;
