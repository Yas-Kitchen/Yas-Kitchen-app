import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Feedback from "./Feedback";
import OrderDetails from "./OrderDetails";
import { orderAPI, Order } from "@/services/api/orders.api";
import { supabase } from "@/lib/supabase";

type FeedbackItem = {
  id: string;
  rating: number;
  comment: string;
  users: { name: string } | null;
  meal_type: string;
};

const Detailed = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

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

    const fetchFeedback = async () => {
      try {
        const { data, error } = await supabase
          .from("feedback")
          .select("id, rating, comment, meal_type, users(name)")
          .order("created_at", { ascending: false })
          .limit(5);
        if (!error && data) {
          setFeedbackList(data as any);
        }
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
      } finally {
        setFeedbackLoading(false);
      }
    };

    fetchOrders();
    fetchFeedback();
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
      {/* Feedback section */}
      <View className="font-poppins bg-white rounded-2xl p-5">
        <Text className="font-poppins-semibold text-[16px] mb-5">
          Recent Feedback
        </Text>
        {feedbackLoading ? (
          <ActivityIndicator color="#FF7629" />
        ) : feedbackList.length === 0 ? (
          <Text className="font-poppins text-gray-400 text-center">
            No feedback yet
          </Text>
        ) : (
          feedbackList.map((fb) => (
            <Feedback
              key={fb.id}
              name={fb.users?.name || "Anonymous"}
              review={fb.rating}
              meal={fb.meal_type}
              comment={fb.comment || ""}
            />
          ))
        )}
      </View>
    </View>
  );
};

export default Detailed;
