export interface IPerson {
  id: string;
  name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  birthday?: string;
  custom_data?: {
    [key: string]: number | string | boolean;
  };
}
