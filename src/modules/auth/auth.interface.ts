
export interface RegisterUserPayload {
  name : string;
  email : string;
  password: string;
  profilePhoto? : string;
  role?: 'TENANT' | 'LANDLORD' | 'ADMIN';
  
}


export interface ILoginUser {
  email : string;
  password :string;
}