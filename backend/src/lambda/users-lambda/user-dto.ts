export interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  department?: string;
}

export interface ICreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  department?: string;
}

export interface IUpdateUserDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  department?: string;
}

export interface ICreateAddressDto {
  id: number;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  province: string;
  postal_code: string;
  recipient: string;
  telephone: string;
}

export interface IUpdateAddressDto {
  id: number;
  preferred: boolean;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  province: string;
  postal_code: string;
  recipient: string;
  telephone: string;
}

export interface ICreatePaymentDto {
  is_paypal?: boolean;
  paypal_id?: string;
  is_credit?: boolean;
  bank_name?: string;
  card_num?: string;
  expiration_data: string;
  first_name: string;
  last_name: string;
}

export interface ICreatePaymentPaypalDto {
  is_paypal: boolean;
  paypal_id: string;
}

export interface ICreatePaymentCreditCardDto {
  is_credit: boolean;
  bank_name?: string;
  card_num: string;
  expiration_date: string;
  first_name: string;
  last_name: string;
}
