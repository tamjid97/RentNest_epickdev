
export type TUserRole = "ADMIN" | "LANDLORD" | "TENANT";
export type TUserStatus = "ACTIVE" | "BLOCKED" | "BANNED";


export interface TAdminUser {
  id: string;
  name: string;
  email: string;
  role: TUserRole;
  activeStatus: TUserStatus;
  createdAt: Date;
  updatedAt: Date;
}


export interface TPropertyCategory {
  id: string;
  name: string;
}


export interface TLandlordInfo {
  id: string;
  name: string;
  email: string;
}


export interface TAdminProperty {
  id: string;
  title: string;
  description: string;
  location: string;
  amenities: string[];
  isAvailable: "AVAILABLE" | "RENTED";
  categoryId: string;
  landlordId: string;
  category?: TPropertyCategory; 
  landlord?: TLandlordInfo;      
  createdAt: Date;
  updatedAt: Date;
}


export interface TAdminRentalRequest {
  id: string;
  propertyId: string;
  clientId: string;
  rentStartDate: string | Date;
  rentEndDate: string | Date;
  status: "PENDING" | "APPROVED" | "REJECTED";
  payableAmount: number;
  property?: {
    title: string;
    location: string;
    landlordId: string;
    landlord?: TLandlordInfo;
  };
  client?: {
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}


export interface TAdminAPIResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}