export interface RegisterUserPayload {
  name : string;
  email : string;
  password: string;
  profilePhoto? : string;
  role?: 'TENANT' | 'LANDLORD' | 'ADMIN';
}

export interface ILoginUser {
  email : string;
  password : string;
}

export interface IUpdateProfilePayload {
  name?: string;
  phoneNumber?: string;
  profilePhoto?: string;
}