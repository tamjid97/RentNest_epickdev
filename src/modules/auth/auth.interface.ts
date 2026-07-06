
export interface RegisterUserPayload {
  name : string;
  email : string;
  password: string;
  profilePhoto? : string;
  
}


export interface ILoginUser {
  email : string;
  password :string;
}