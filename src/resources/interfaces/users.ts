export interface SaveUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  ip: string;
}

export interface UserJWTokenType {
  _id: number;
  _ip: string;
}
