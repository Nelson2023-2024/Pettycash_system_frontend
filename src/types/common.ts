export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  error: string;
}

export interface ChildrenProps {
  children: React.ReactNode;
}

