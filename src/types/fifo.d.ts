/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'localstorage-fifo' {
  class Fifo {
    constructor(options: { namespace: string; console: VoidCallback });
    namespace: string;
    noLS: boolean;
    console: any;
    data: {
      keys: any[];
      items: any;
    };
    set(key: string, value: any): void;
    get(): any[];
    get(key: string): any;
    keys(): any[];
    empty(): void;
    remove(key: string): void;
  }

  export = Fifo;
}
