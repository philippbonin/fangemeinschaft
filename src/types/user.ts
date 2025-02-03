export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Only used for creation/update
  lastLogin?: Date;
  created_at?: string;
  updated_at?: string;
}