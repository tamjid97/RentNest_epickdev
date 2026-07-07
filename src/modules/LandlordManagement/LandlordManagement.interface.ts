export interface PropertyPayload {
  title: string;
  location: string;
  categoryId: string;   
  description?: string; 
  amenities?: string[]; 
  price : number; 
}