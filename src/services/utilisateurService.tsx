
export interface User {
    id: number;
    nom: string;
    email: string;
    password: string; 
    role: 'ADMIN' | 'UTILISATEUR';
  }
  
  

  import axios from 'axios';

  const API_URL = 'http://localhost:8080/api/user';
  
  // Get user by ID
  export const getUserById = async (id: number): Promise<User> => {
    try {
      const response = await axios.get<User>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  };
  
  // Get all users
  export const getAllUsers = async (): Promise<User[]> => {
    try {
      const response = await axios.get<User[]>(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  };
  
  // Sign up new user
  export const signUp = async (user: User): Promise<User> => {
    try {
      const response = await axios.post<User>(`${API_URL}/signup`, user);
      return response.data;
    } catch (error) {
      console.error('Error signing up user:', error);
      throw error;
    }
  };
  
  // Sign in
  export const signIn = async (email: string, password: string): Promise<User> => {
    try {
      const response = await axios.post<User>(`${API_URL}/signin`, null, { params: { email, password } });
      return response.data;
    } catch (error) {
      console.error('Error signing in user:', error);
      throw error;
    }
  };
  
  // Update user
  export const updateUser = async (id: number, updatedUser: User): Promise<User> => {
    try {
      const response = await axios.put<User>(`${API_URL}/${id}`, updatedUser);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };
  export const deleteUser = async (id: number): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };
  export const getTotalUsers = async (): Promise<number> => {
    try {
      const response = await axios.get<number>(`${API_URL}/total`);
      return response.data;
    } catch (error) {
      console.error('Error fetching total users:', error);
      throw error;
    }
  };