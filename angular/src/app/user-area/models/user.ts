export class UserDataResponse {
  user: string;
  role: string;
  logged: boolean;
}

export class TokenString {
  token: string;
}
export class UserResetPassword{
  token : string;
  password : string;
}