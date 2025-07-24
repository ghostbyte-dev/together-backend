export interface ApiResponse<T = undefined> {
  status: string;
  data: T;
  error: string | undefined;
}
