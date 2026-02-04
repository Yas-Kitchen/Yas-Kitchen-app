import AllPopup from "@/components/Popup/AllPopup";
import Fadebg from "@/components/shared/Faded";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";

import React, { ComponentProps, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FeatherIconName = ComponentProps<typeof Feather>["name"];

const { width } = Dimensions.get("window");
const TAB_COUNT = 4;
const TAB_WIDTH = width / TAB_COUNT;

function CustomTabBar({ state, descriptors, navigation }: any) {
  const translateX = useRef(new Animated.Value(0)).current;
  const pillWidth = useRef(new Animated.Value(TAB_WIDTH)).current;
  const previousIndex = useRef(0);
  const [tabLayouts, setTabLayouts] = React.useState<
    { x: number; width: number }[]
  >([]);

  useEffect(() => {
    if (tabLayouts[state.index]) {
      const { x, width } = tabLayouts[state.index];
      
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: x,
          useNativeDriver: false,
          tension: 68,
          friction: 10,
        }),
        Animated.spring(pillWidth, {
          toValue: width,
          useNativeDriver: false,
          tension: 68,
          friction: 10,
        })
      ]).start();

      previousIndex.current = state.index;
    }
  }, [state.index, tabLayouts, pillWidth, translateX]);

  const getTabConfig = (
    routeName: string
  ): { icon: FeatherIconName; label: string } => {
    switch (routeName) {
      case "admin":
        return { icon: "home", label: "Home" };
      case "Dashboard":
        return { icon: "bar-chart", label: "Dashboard" };
      case "Manage":
        return { icon: "settings", label: "Manage" };
      case "Users":
        return { icon: "users", label: "Users" };
      default:
        return { icon: "home", label: routeName };
    }
  };

  return (
    <View className="font-poppins absolute bottom-0 left-0 right-0 pb-8 px-4 bg-transparent">
      <View
        className="font-poppins bg-white border border-base_color/10 rounded-full shadow-2xl mx-2 overflow-hidden"
        style={{
          flexDirection: "row",
          position: "relative",
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            top: 6,
            bottom: 6,
            backgroundColor: "#FF76291A",
            borderRadius: 50,
            transform: [
              {
                translateX:
                  state.index === 0
                    ? Animated.add(translateX, 4) 
                    : state.index === state.routes.length - 1
                    ? Animated.add(translateX, 2) 
                    : translateX, 
              },
            ],
            width:
              state.index === 0 || state.index === state.routes.length - 1
                ? Animated.add(pillWidth, -8)
                : pillWidth, 
          }}
        />

        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const { icon, label } = getTabConfig(route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              Haptics.selectionAsync()
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 12,
              }}
              activeOpacity={0.7}
              onLayout={(event) => {
                const { x, width } = event.nativeEvent.layout;
                setTabLayouts((prev) => {
                  const copy = [...prev];
                  copy[index] = { x, width };
                  return copy;
                });
              }}
            >
              <Feather
                name={icon}
                size={24}
                color={isFocused ? "#FF7629" : "#9CA3AF"}
                style={{ marginBottom: 4 }}
              />

              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400" as any,
                  textAlign: "center",
                  color: isFocused ? "#FF7629" : "#9CA3AF",
                }}
                numberOfLines={1}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <View className="font-poppins flex-1 min-h-screen ">
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          animation: 'shift',
        }}
      >
        <Tabs.Screen 
          name="admin"
          options={{
            animation: 'shift',
          }}
        />
        <Tabs.Screen 
          name="Dashboard"
          options={{
            animation: 'shift',
          }}
        />
        <Tabs.Screen 
          name="Manage"
          options={{
            animation: 'shift',
          }}
        />
        <Tabs.Screen 
          name="Users"
          options={{
            animation: 'shift',
          }}
        />
      </Tabs>
      <Fadebg/>
      <AllPopup/>
    </View>
  );
}
