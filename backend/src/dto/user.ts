export interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  department?: string;
}

export interface CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  department?: string;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  department?: string;
}

export interface CreateAddressDto {
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  province: string;
  postal_code: string;
  recipient: string;
  telephone: string;
}

export interface UpdateAddressDto {
  address_line_1?: string;
  address_line_2?: string | null;
  city?: string;
  province?: string;
  postal_code?: string;
  recipient?: string;
  telephone?: string;
}
