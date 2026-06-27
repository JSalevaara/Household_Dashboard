import apiClient from "./client";

export interface ChangePassword {
  old_password: string;
  new_password: string;
}

export interface ChangeUsername {
  password: string;
  new_username: string;
}

export const userService = {
  changePassword: async (passwordData: ChangePassword) => {
    const response = await apiClient.put("/users/me/password", passwordData);
    return response.data;
  },

  changeUsername: async (usernameData: ChangeUsername) => {
    const response = await apiClient.put("/users/me/username", usernameData);
    return response.data;
  },
};
