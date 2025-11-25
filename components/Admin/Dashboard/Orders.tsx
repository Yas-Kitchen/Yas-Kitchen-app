import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { orderAPI, Order } from "@/services/api/orders.api";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getPendingOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (
    orderId: string,
    status: "confirmed" | "cancelled"
  ) => {
    try {
      await orderAPI.updateOrderStatus(orderId, status);
      Alert.alert("Success", `Order ${status} successfully`);
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error(`Failed to ${status} order:`, error);
      Alert.alert("Error", `Failed to ${status} order`);
    }
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center gap-4">
        {item.users?.profile_image_url ? (
          <Image
            source={{ uri: item.users.profile_image_url }}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
            <Feather name="user" size={20} color="#9CA3AF" />
          </View>
        )}
        <View className="flex-1">
          <Text className="font-semibold text-base text-gray-800">
            {item.users?.name || "Unknown User"}
          </Text>
          <Text className="text-xs text-gray-500">
            {item.users?.phone_number}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
        <Text className="font-bold text-primary text-lg">
          AED {item.total_amount}
        </Text>
      </View>

      <View className="mt-4 pt-4 border-t border-gray-100 flex-row gap-3">
        <TouchableOpacity
          onPress={() => handleUpdateStatus(item.id, "confirmed")}
          className="flex-1 bg-primary py-3 rounded-xl items-center"
        >
          <Text className="text-white font-semibold">Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleUpdateStatus(item.id, "cancelled")}
          className="flex-1 bg-red-50 py-3 rounded-xl items-center border border-red-100"
        >
          <Text className="text-red-500 font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#FF7629" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      {orders.length === 0 ? (
        <View className="items-center justify-center py-10">
          <Feather name="shopping-bag" size={48} color="#D1D5DB" />
          <Text className="text-gray-400 mt-4">No pending orders</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false} // Since it's inside a ScrollView in Dashboard
        />
      )}
    </View>
  );
};

export default Orders;
