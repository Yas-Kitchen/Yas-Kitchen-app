import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useGlobalContext } from "@/context/GlobalContext";
import axios from "axios";
import { storage } from "@/services/storage";

interface UserTypes {
  id?: string;
  name: string;
  number: string;
  category: string;
  status: string;
  joindate: string;
  onStatusChange?: () => void;
}

const IndividualUsers = ({
  id,
  name,
  number,
  category,
  status,
  joindate,
  onStatusChange,
}: UserTypes) => {
  const { setPopupNames, setSelectedUser } = useGlobalContext();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState(false);

  const isAdminAccount = name.toLocaleLowerCase() === "admin";

  const statusOptions = [
    { value: "active", label: "Active", color: "#16A34A", bg: "#DCFCE7" },
    { value: "pending", label: "Pending", color: "#CA8A04", bg: "#FEF9C3" },
    { value: "paused", label: "Paused", color: "#DC2626", bg: "#FEE2E2" },
  ];

  const handleEdit = () => {
    if (setSelectedUser) {
      setSelectedUser({
        id,
        name,
        number,
        category,
        status: currentStatus,
        joindate,
      });
    }
    setPopupNames("edituser");
  };

  const handleStatusChange = async (newStatus: string) => {
    setShowStatusMenu(false);

    if (newStatus === currentStatus.toLowerCase()) {
      return;
    }

    if (isAdminAccount && newStatus === "paused") {
      Alert.alert(
        "Cannot Deactivate Admin",
        "The main admin account cannot be deactivated for security reasons"
      );
      return;
    }
    setLoading(true);
    try {
      const tokens = await storage.getTokens();

      if (!tokens.accessToken) {
        Alert.alert("Error", "Authentication required");
        return;
      }

      let endpoint = "";
      if (newStatus === "active") {
        endpoint = `/admin/users/${id}/activate`;
      } else if (newStatus === "paused") {
        endpoint = `/admin/users/${id}/deactivate`;
      } else {
        Alert.alert("Info", "Cannot set status to pending manually");
        return;
      }

      await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        }
      );

      setCurrentStatus(newStatus);
      Alert.alert("Success", `User status changed to ${newStatus}`, [
        {
          text: "OK",
          onPress: () => {
            if (onStatusChange) onStatusChange();
          },
        },
      ]);
    } catch (error: any) {
      console.error(
        "Status change error:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to change user status"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isAdminAccount) {
      Alert.alert(
        "Cannot Delte Admin",
        "The main admin account cannot be deleted for security reasons"
      );
    }
    Alert.alert("Delete User", `Are you sure you want to delete ${name}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const tokens = await storage.getTokens();

            if (!tokens.accessToken) {
              Alert.alert("Error", "Authentication required");
              return;
            }

            await axios.delete(
              `${process.env.EXPO_PUBLIC_API_URL}admin/users/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              }
            );

            Alert.alert("Success", "User deleted successfully", [
              {
                text: "OK",
                onPress: () => {
                  if (onStatusChange) onStatusChange();
                },
              },
            ]);
          } catch (error: any) {
            console.error(
              "Delete error:",
              error.response?.data || error.message
            );
            Alert.alert(
              "Error",
              error.response?.data?.message || "Failed to delete user"
            );
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
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
    <View className="bg-white relative rounded-2xl p-4 gap-2">
      {loading && (
        <View className="absolute inset-0 bg-black/10 rounded-2xl z-50 justify-center items-center">
          <ActivityIndicator size="large" color="#FF7629" />
        </View>
      )}

      <Text
        className={`text-sm ${
          isAdminAccount && "text-primary font-bold"
        }  font-semibold`}
      >
        {name}
      </Text>
      <Text className="text-base_color text-xs">{number}</Text>

      <View className="flex-row items-center gap-4">
        {!isAdminAccount && (
          <Text className="p-2 rounded-full bg-primary/10 text-primary text-[10px]">
            {category}
          </Text>
        )}

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

      <View className="flex-row absolute top-5 right-5 gap-2">
        {!isAdminAccount && (
          <TouchableOpacity
            onPress={handleEdit}
            className="flex-row bg-[#F3F4F6] p-1 text-center items-center rounded-lg gap-1"
          >
            <Feather color={"#212529"} size={15} name="edit" />
            <Text className="text-xs">Edit</Text>
          </TouchableOpacity>
        )}

        {!isAdminAccount && (
          <TouchableOpacity
            onPress={handleDelete}
            className="flex-row bg-primary/10 p-1 rounded-lg items-center gap-1"
          >
            <Feather color={"#FF7629"} size={15} name="trash-2" />
            <Text className="text-primary text-xs">Delete</Text>
          </TouchableOpacity>
        )}
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
  );
};

export default IndividualUsers;
