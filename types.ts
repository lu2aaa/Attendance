
export interface Employee {
  employee_id: string;
  name: string;
  national_id: string;
  phone: string;
  email: string;
  specialty: string;
  qualification: string;
  start_date: string;
  working_days: string[];
  status: string;
  regular_leave_balance: number;
  casual_leave_balance: number;
  breastfeeding: boolean;
  disability: boolean;
  gender: string;
  job_grade: string;
  training_courses: string;
  religion: string;
  admin_tasks: string;
  secret_code: string;
  photo_url: string;
  id_card_url: string;
  deputations: string;
  leaves_history: string;
  current_workplace: string;
  penalties: string;
  emergency_phone: string;
  blood_type: string;
  insurance_number: string;
  practice_number: string;
  graduation_place: string;
  postgraduate: string;
  address: string;
}

export interface Movement {
  id?: string;
  employee_id: string;
  type: string;
  start_date: string;
  end_date: string;
  return_date: string;
  on_behalf: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
}

export interface Evaluation {
  id?: string;
  employee_id: string;
  month: string;
  appearance: number;
  attendance: number;
  quality_committees: number;
  infection_control: number;
  training_commitment: number;
  medical_files: number;
  performance: number;
  total: number;
}

export interface AttendanceRecord {
  id?: string;
  employee_id: string;
  date: string;
  fingerprints: string; // Space separated times
}

export interface AdminSettings {
  center_name: string;
  secret_code: string;
  manager_name: string;
  manager_phone: string;
  manager_email: string;
  deputy_1: string;
  deputy_2: string;
  org_structure: string;
  dept_heads: string;
  specialties: string[];
}
