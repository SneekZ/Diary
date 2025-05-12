import { type FC, useContext, useCallback, useState, useEffect } from "react";
import styles from "./Register.module.scss";
import { Button, Input } from "antd";
import httpClient from "../../api/axiosConfig";
import { type UserAll } from "../../structures/User";
import { notification } from "antd";
import { useNavigate } from "react-router";
import { UserContext } from "../../context/user/UserContext";

const RegisterPage: FC = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const { login } = useContext(UserContext);

  const [typedLogin, setTypedLogin] = useState<string>("");
  const [typedPassword, setTypedPassword] = useState<string>("");

  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [validInput, setValidInput] = useState<boolean>(false);

  const register = useCallback(
    async (
      user: UserAll,
      positiveCallback: () => void,
      callback: () => void
    ) => {
      httpClient
        .post("/register/", {
          ...user,
        })
        .then(() => {
          login(user, positiveCallback, callback);
        })
        .catch((e) => {
          api.open({
            message: "Error",
            description:
              typeof e.response?.data?.detail === "object"
                ? JSON.stringify(e.response.data.detail)
                : e.response?.data?.detail || "Возникла неизвестная ошибка",
            showProgress: true,
            pauseOnHover: true,
          });
        })
        .finally(callback);
    },
    [api, login]
  );

  useEffect(() => {
    setValidInput(
      typedLogin.length >= 4 &&
        typedLogin.length <= 16 &&
        typedPassword.length >= 4 &&
        typedPassword.length <= 16 &&
        firstName.length >= 3 &&
        firstName.length <= 16 &&
        lastName.length >= 3 &&
        lastName.length <= 16
    );
  }, [typedLogin, typedPassword, firstName, lastName]);

  return (
    <>
      {contextHolder}
      <div className={styles.center_container}>
        <div className={styles.container}>
          <span className={styles.title}>Регистрация</span>
          <Input
            placeholder="Введите имя пользователя..."
            onChange={(e) => setTypedLogin(e.target.value)}
          />
          <Input
            placeholder="Введите пароль..."
            type="password"
            onChange={(e) => setTypedPassword(e.target.value)}
          />
          <Input
            placeholder="Введите имя..."
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            placeholder="Введите фамилию..."
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            placeholder="Введите дату рождения..."
            onChange={(e) => setBirthDate(new Date(e.target.value))}
            type="date"
          />
          <Input
            placeholder="Введите описание..."
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            type="primary"
            onClick={() => {
              setLoading(true);
              register(
                {
                  login: typedLogin,
                  password: typedPassword,
                  firstName: firstName,
                  lastName: lastName,
                  birthDate: birthDate,
                  description: description,
                },
                () => navigate("/diary"),
                () => setLoading(false)
              );
            }}
            loading={loading}
            disabled={!validInput}
            style={{
              color: "white",
            }}
          >
            Создать аккаунт
          </Button>
          <Button type="link" onClick={() => navigate("/login")}>
            У меня уже есть аккаунт
          </Button>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
