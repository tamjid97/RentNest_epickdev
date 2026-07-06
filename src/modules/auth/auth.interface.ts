
export interface RegisterUserPayload {
  name : string;
  email : string;
  password: string;
  profilePhoto? : string;
  role?: 'TENANT' | 'LANDLORD';
  
}


export interface ILoginUser {
  email : string;
  password :string;
}