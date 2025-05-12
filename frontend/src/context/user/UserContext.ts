import { createContext } from "react";
import {
  type UserModel,
  type UserLogin,
  defaultUserModel,
} from "../../structures/User";

interface UserContextProps {
  loggedIn: boolean;
  user: UserModel;
  login: (
    user: UserLogin,
    positiveCallback: () => void,
    callback: () => void
  ) => void;
  patchUser: (user: UserModel, callback: () => void) => void;
  logout: (callback: () => void) => void;
}

export const UserContext = createContext<UserContextProps>({
  loggedIn: false,
  user: defaultUserModel,
  login: () => {},
  patchUser: () => {},
  logout: () => {},
});
