export interface IAppRelease {
  type: string;
  version?: string | null;
  build_number?: number | null;
  sdk_version: string;
}
