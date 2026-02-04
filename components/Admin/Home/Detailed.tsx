import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Feedback from "./Feedback";
import OrderDetails from "./OrderDetails";
import { orderAPI, Order } from "@/services/api/orders.api";

const Detailed = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getTodayOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch today orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <View className="font-poppins mx-5 mb-10 gap-5">
      <View className="font-poppins bg-white rounded-2xl p-5 gap-2">
        <Text className="text-[16px] font-poppins-semibold text-faded_black mb-2">
          Today&apos;s Orders by User&apos;s
        </Text>
        <View className="font-poppins gap-5">
          {loading ? (
            <ActivityIndicator color="#FF7629" />
          ) : orders.length === 0 ? (
            <Text className="font-poppins text-gray-400 text-center">
              No orders for today
            </Text>
          ) : (
            orders.map((order) => (
              <OrderDetails
                key={order.id}
                name={order.users?.name || "Unknown"}
                number={parseInt(order.users?.phone_number || "0")}
                style={order.items?.[0]?.category || "General"}
                plan={order.items?.[0]?.name || "Meal"}
                addons={
                  order.items
                    ?.filter((i) => i.category === "Add-ons")
                    .map((i) => i.name) || []
                }
              />
            ))
          )}
        </View>
      </View>
      {/* Feedback section - currently separate, maybe fetch later */}
      <Feedback
        name="Basil Joseph"
        review={4.5}
        meal="Rice and sambar"
        comment="Excellent taste and perfect spice level!"
      />
    </View>
  );
};

export default Detailed;
