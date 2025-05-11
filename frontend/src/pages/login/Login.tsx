import { type FC, useContext, useCallback } from "react";
import { UserContext } from "../../context/user/UserContext";
import styles from "./Login.module.scss";
import { Button } from "antd";
import httpClient from "../../api/axiosConfig";
import { type UserLogin } from "../../structures/User";
import { notification } from "antd";

const LoginPage: FC = () => {
  const [api, contextHolder] = notification.useNotification();

  const { login } = useContext(UserContext);

  const register = useCallback(
    async (user: UserLogin, callback: () => void) => {
      httpClient
        .post("/register/")
        .then(() => {
          login(user, callback);
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
    [api, login]
  );

  return (
    <>
      {contextHolder}
      <div className={styles.center_container}>
        <div className={styles.container}>123</div>
      </div>
    </>
  );
};

export default LoginPage;
