// ১. ইউজার স্ট্যাটাস এবং রোলের এনাম/টাইপ
export type TUserRole = "ADMIN" | "LANDLORD" | "TENANT";
export type TUserStatus = "ACTIVE" | "BLOCKED" | "BANNED";

// ২. ইউজার ইন্টারফেস
export interface TAdminUser {
  id: string;
  name: string;
  email: string;
  role: TUserRole;
  status: TUserStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ৩. ক্যাটাগরি ইন্টারফেস (প্রপার্টির সাথে ইনক্লুড থাকবে)
export interface TPropertyCategory {
  id: string;
  name: string;
}

// ৪. ল্যান্ডলর্ড ডিটেইলস ইন্টারফেস
export interface TLandlordInfo {
  id: string;
  name: string;
  email: string;
}

// ৫. প্রপার্টি ইন্টারফেস (উইথ রিলেশন ডাটা)
export interface TAdminProperty {
  id: string;
  title: string;
  description: string;
  location: string;
  amenities: string[];
  isAvailable: "AVAILABLE" | "RENTED";
  categoryId: string;
  landlordId: string;
  category?: TPropertyCategory; // include কুয়েরির জন্য ওয়ানাল
  landlord?: TLandlordInfo;      // include কুয়েরির জন্য অপশনাল
  createdAt: Date;
  updatedAt: Date;
}

// ৬. রেন্টাল রিকোয়েস্ট ইন্টারফেস (উইথ রিলেশন ডাটা)
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

// ৭. এপিআই রেসপন্স ফরম্যাট (যদি ফ্রন্টএন্ডে টাইপ কাস্টিং করতে চাও)
export interface TAdminAPIResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}