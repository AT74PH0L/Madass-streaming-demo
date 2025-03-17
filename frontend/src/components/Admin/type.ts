// Shared types for the admin dashboard
export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "creator" | "user";
    avatar?: string;
  }
  
  export interface Movie {
    id: string;
    name: string;
    pathImg: string;
    description: string;
  }
  
  export interface UserRes {
      id: string;
      displayName: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      picture?: string;
      role: "admin" | "creator" | "user";
      createdAt: string;
      updatedAt: string;
    }
    
  