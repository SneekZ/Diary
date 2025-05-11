export interface UserLogin {
  login: string;
  password: string;
}

export interface UserModel {
  firstName: string;
  lastName: string;
  birthDate: Date;
  description: string;
}

export const defaultUserModel: UserModel = {
  firstName: "",
  lastName: "",
  birthDate: new Date(),
  description: "",
};

export interface UserAll extends UserLogin, UserModel {}
