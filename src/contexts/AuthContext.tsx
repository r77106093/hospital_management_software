import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterData } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'doctor@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    phone: '+1234567890',
    specialization: 'Cardiology',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'patient@email.com',
    password: 'patient123',
    role: 'patient',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567891',
    dateOfBirth: '1990-01-01',
    address: '123 Main St, City, State',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'staff@hospital.com',
    password: 'staff123',
    role: 'staff',
    firstName: 'Mary',
    lastName: 'Smith',
    phone: '+1234567892',
    department: 'Administration',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      setLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      specialization: userData.specialization,
      department: userData.department,
      dateOfBirth: userData.dateOfBirth,
      address: userData.address,
      createdAt: new Date().toISOString()
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};