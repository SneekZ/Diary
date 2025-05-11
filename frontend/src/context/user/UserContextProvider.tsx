import httpClient from "../../api/axiosConfig";
import {
  type UserModel,
  type UserLogin,
  defaultUserModel,
} from "../../structures/User";
import { UserContext } from "./UserContext";
import { type FC, useState, useCallback, type ReactNode } from "react";
import { notification } from "antd";

const UserContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedIn, setLoggingIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserModel>(defaultUserModel);

  const [api, contextHolder] = notification.useNotification();

  const login = useCallback(
    async (user: UserLogin, callback: () => void) => {
      httpClient
        .post("/login/", {
          ...user,
        })
        .then((response) => {
          setLoggingIn(true);
          setUser(response.data as unknown as UserModel);
          console.log(response.data as unknown as UserModel);
        })
        .catch((e) => {
          api.open({
            message: "Error",
            description:
              e.response?.data?.detail || "Возникла неизвестная ошибка",
            showProgress: true,
            pauseOnHover: true,
          });
        })
        .finally(callback);
    },
    [api]
  );

  const patchUser = useCallback(
    async (user: UserModel, callback: () => void) => {
      httpClient
        .patch("/user/", {
          ...user,
        })
        .then(() => {
          setUser(user);
        })
        .catch((e) => {
          api.open({
            message: "Error",
            description:
              e.response?.data?.detail || "Возникла неизвестная ошибка",
            showProgress: true,
            pauseOnHover: true,
          });
        })
        .finally(callback);
    },
    [api]
  );

  const logout = useCallback(
    async (callback: () => void) => {
      httpClient
        .post("/logout/")
        .then(() => {
          setLoggingIn(false);
          setUser(defaultUserModel);
        })
        .catch((e) => {
          api.open({
            message: "Error",
            description:
              e.response?.data?.detail || "Возникла неизвестная ошибка",
            showProgress: true,
            pauseOnHover: true,
          });
        })
        .finally(callback);
    },
    [api]
  );

  return (
    <UserContext value={{ loggedIn, user, login, patchUser, logout }}>
      {contextHolder}
      {children}
    </UserContext>
  );
};

export default UserContextProvider;
