import { type FC, useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/user/UserContext";
import styles from "./Login.module.scss";
import { Button, Input } from "antd";
import { useNavigate } from "react-router";

const LoginPage: FC = () => {
  const navigate = useNavigate();

  const { login } = useContext(UserContext);

  const [typedLogin, setTypedLogin] = useState<string>("");
  const [typedPassword, setTypedPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [validInput, setValidInput] = useState<boolean>(false);

  useEffect(() => {
    setValidInput(
      typedLogin.length >= 4 &&
        typedLogin.length <= 16 &&
        typedPassword.length >= 4 &&
        typedPassword.length <= 16
    );
  }, [typedLogin, typedPassword]);

  return (
    <>
      <div className={styles.center_container}>
        <div className={styles.container}>
          <span className={styles.title}>Вход</span>
          <Input
            placeholder="Введите имя пользователя..."
            onChange={(e) => setTypedLogin(e.target.value)}
          />
          <Input
            placeholder="Введите пароль..."
            type="password"
            onChange={(e) => setTypedPassword(e.target.value)}
          />
          <Button
            type="primary"
            onClick={() => {
              setLoading(true);
              login(
                { login: typedLogin, password: typedPassword },
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
            Войти
          </Button>
          <Button type="link" onClick={() => navigate("/register")}>
            Регистрация
          </Button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
