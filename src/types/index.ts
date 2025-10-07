export interface User {
  id: string;
  email: string;
  role: 'doctor' | 'patient' | 'staff';
  firstName: string;
  lastName: string;
  phone?: string;
  specialization?: string; // for doctors
  department?: string; // for staff
  dateOfBirth?: string; // for patients
  address?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  patientName?: string;
  doctorName?: string;
  createdAt: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  doctorId?: string;
  title: string;
  description: string;
  type: 'lab' | 'scan' | 'prescription' | 'diagnosis';
  fileUrl?: string;
  createdAt: string;
  uploadedBy: string;
  patientName?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'doctor' | 'patient' | 'staff';
  phone?: string;
  specialization?: string;
  department?: string;
  dateOfBirth?: string;
  address?: string;
}