import api from "@/services/api";
import { userAPI } from "@/services/api/user.api";
import { UserTypes } from "@/types/user.types";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAlert } from "@/context/AlertContext";

export const useUserAPI = () => {
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserTypes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const user = await userAPI.getUserProfile();

      setUser(user);
    } catch (err: any) {
      console.log("Failed to fetch user :", err);
    } finally {
      setLoading(false);
    }
  };

  const getAllUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const usersResponse = await userAPI.getAllUser();
      setUsers(usersResponse);
    } catch (err: any) {
      console.log("Failed to fetch all users", err);
      setError(err?.message || "Unable to load users");
      showAlert(
        "Users unavailable",
        err?.response?.data?.detail?.message ||
        "Failed to fetch users. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (payload: any) => {
    setLoading(true);
    try {
      const data = await userAPI.updateUserProfile(payload);
      return data;
    } catch (err) {
      console.log("Failed to update user:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategories = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.updateUserCategories(userId);
      return data;
    } catch (err: any) {
      console.error("Failed to update category:", err?.message);
      setError(err?.message || "Failed to update Category");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await userAPI.deleteUserProfile(userId);
    } catch (err: any) {
      setError(err?.message || "failed to delete user");
      console.error(`Failed to delete with userId : ${userId}`);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    setLoading(true);
    setError(null);

    try {
      if (newStatus === "active") {
        await userAPI.activateUserProfile(userId);
      } else if (newStatus === "paused") {
        await userAPI.deactivateUserProfile(userId);
      } else {
        console.warn("Invalid status :", newStatus);
        return;
      }
      showAlert("Success", `User status has been change to ${newStatus}`);
      await getAllUsers();
    } catch (err: any) {
      console.error("Update user api error :", err);
      setError(err?.message || "Unable to change user status");
      showAlert("Failed", "Failed to change user status ");
    } finally {
      setLoading(false);
    }
  };

  const toggleUserPasswordReset = async (
    userId: string,
    currentIsPasswordSet: boolean
  ) => {
    setLoading(true);
    setError(null);
    try {
      const newStatus = !currentIsPasswordSet;
      const { error } = await supabase
        .from("users")
        .update({ is_password_set: newStatus })
        .eq("id", userId);

      if (error) throw error;

      // Optimistic update or refetch
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, is_password_set: newStatus } : u
        )
      );

      const action = newStatus
        ? "Marked as Password Set"
        : "Reset Allowed (Password Unset)";
      showAlert("Success", `User ${action}`);
      return true;
    } catch (err: any) {
      console.error("Failed to toggle password reset:", err);
      setError(err?.message || "Failed to toggle password reset");
      showAlert("Error", "Failed to update password status");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setProfileImage = async (imageUri: string) => {
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "upload.jpg",
      } as any);

      formData.append("category", "profile");

      const response = await api.post("images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await updateUser({ profile_image_url: response.data.data.url });
    } catch (err: any) {
      console.error("Failed to upload profile image : ", err);
      setError(err?.message || "Failed to update profile image");
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchUserData,
    loading,
    getAllUsers,
    users,
    updateUser,
    updateUserStatus,
    toggleUserPasswordReset,
    deleteUser,
    error,
    user,
    updateCategories,
    setProfileImage,
  };
};
