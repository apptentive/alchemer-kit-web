export type IPersonResponse = {
  id: string;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  address: string | null;
  birthday: string | null;
  custom_data?: {
    [key: string]: number | string | boolean;
  };
};
