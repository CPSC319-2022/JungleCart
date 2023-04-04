export const PHONE_REGEX = /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/;
export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const ADDRESS_REGEX = /^([a-zA-Z0-9\s\,\.\-]{3,})$/;
export const CREDIT_CARD_REGEX = /^([0-9]{16})$/;
export const CVC_REGEX = /^([0-9]{3})$/;
export const EXPIRY_DATE_REGEX = /^([0-9]{2}\/[0-9]{2})$/;
