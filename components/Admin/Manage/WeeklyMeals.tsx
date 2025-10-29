import { useGlobalContext } from "@/context/GlobalContext";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import MealList from "./MealList";
import { storage } from "@/services/storage";

interface Category {
  label: string;
  value: string;
  name: string;
}

const WeeklyMeals = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { setPopupNames,selectedCategory,setSelectedCategory,mealListRef} = useGlobalContext();

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const tokens = await storage.getTokens();
      
     const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}cuisine-types/`,  
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokens.accessToken}`,
        },
      }
    );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      
      const formatted = data.map((cuisine: any) => ({
        label: cuisine.name,
        value: cuisine.id,
        name: cuisine.name,
      }));
      
      setCategories(formatted);

      if(formatted.length > 0 && !selectedCategory){
        setSelectedCategory(formatted[0].value)
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const tokens = await storage.getTokens();
      
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/admin/cuisine-types/${categoryId}`,  // ✅ Backend: cuisine-types
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${tokens.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => c.value !== categoryId));
      
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
      }

      Alert.alert("Success", "Category deleted successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to delete category");
    }
  };

  return (
    <>
      <View
        className="flex-row justify-between items-center text-[12px]"
        style={{ zIndex: 500 }}
      >
        <View className="flex-row gap-2">
          <View className="w-40" style={{ zIndex: 500 }}>
            <DropDownPicker
              open={open}
              value={selectedCategory}
              items={categories}
              setOpen={setOpen}
              setValue={(callback) => {
                const value =
                  typeof callback === "function"
                    ? callback(selectedCategory)
                    : callback;
                setSelectedCategory(value);
              }}
              setItems={setCategories}
              listMode="SCROLLVIEW"
              placeholder="Select Category"  
              placeholderStyle={{ color: "#999" }}
              style={{
                borderRadius: 8,
                borderColor: "transparent",
                backgroundColor: "rgba(255, 118, 41, 0.1)",
                minHeight: 36,
                height: 36,
                paddingVertical: 0,
              }}
              dropDownContainerStyle={{
                borderColor: "transparent",
                borderRadius: 8,
                backgroundColor: "white",
              }}
              textStyle={{ fontSize: 12, color: "#FF7629" }}
              disabled={categories.length === 0 || loading}
              disabledStyle={{ opacity: 0.5 }}
              renderListItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCategory(item.value ?? null);
                      setOpen(false);
                    }}
                    style={{ flex: 1 }}
                  >
                    <Text style={{ fontSize: 12, color: "#FF7629" }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (!item.value) return;
                      Alert.alert(
                        "Delete Category",  
                        `Are you sure you want to delete "${item.label}"?`,
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => handleDeleteCategory(item.value!),
                          },
                        ]
                      );
                    }}
                    style={{ padding: 4 }}
                  >
                    <Feather name="trash-2" size={16} color="#FF7629" />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <TouchableOpacity
            onPress={() => setPopupNames("addcategory")} 
            className="flex-row items-center gap-1 bg-primary/10 rounded-lg"
            style={{ height: 36, paddingHorizontal: 8 }}
          >
            <Feather name="folder-plus" size={16} color={"#FF7629"} />
            <Text className="text-primary font-medium text-[12px]">
              Add Category  
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!selectedCategory) {
                Alert.alert("Error", "Please select a category first"); 
                return;
              }
              setPopupNames("addmeal");
            }}
            className="flex-row items-center gap-1 bg-primary/10 rounded-lg"
            style={{
              height: 36,
              paddingHorizontal: 8,
              opacity: !selectedCategory ? 0.5 : 1,
            }}
            disabled={!selectedCategory}
          >
            <Feather name="plus" size={16} color={"#FF7629"} />
            <Text className="text-primary font-medium text-[12px]">
              Add Meal
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-5">
        {loading ? (
          <Text className="text-gray-400 text-center mt-10">
            Loading categories...  
          </Text>
        ) : categories.length === 0 ? (
          <View className="items-center justify-center mt-10">
            <Feather name="folder-plus" size={48} color="#ddd" />
            <Text className="text-gray-400 text-center mt-4 text-base">
              No categories yet  
            </Text>
            <Text className="text-gray-400 text-center text-sm">
              Create your first category to get started  
            </Text>
          </View>
        ) : selectedCategory ? (
          <MealList ref={mealListRef} categoryId={selectedCategory} /> 
        ) : (
          <Text className="text-gray-400 text-center mt-10">
            Select a category to view meals  
          </Text>
        )}
      </View>
    </>
  );
};

export default WeeklyMeals;
