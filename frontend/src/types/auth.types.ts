// User types matching backend
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'TEACHER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}

export interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
}
