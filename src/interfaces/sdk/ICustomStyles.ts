export interface ICustomStyles {
  skipStyles: boolean;
  customStyles: boolean;
  settings: {
    styles: {
      [key: string]: string;
    };
  };
}
