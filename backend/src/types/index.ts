// Placeholder untuk type definitions global backend
export interface APIResponse<T> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  results?: number;
  data?: T;
}
