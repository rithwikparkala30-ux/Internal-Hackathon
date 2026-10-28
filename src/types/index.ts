export type Branch = 'Computer Science' | 'Information Technology' | 'Electronics & Comm' | 'Mechanical' | 'Electrical';

export type PlacementStatus = 'Unplaced' | 'In Process' | 'Placed';

export type ApplicationStatus = 
  | 'Applied' 
  | 'Shortlisted' 
  | 'Assessment Passed' 
  | 'Interview Scheduled' 
  | 'Offered' 
  | 'Rejected';

export type UserRole = 'admin' | 'student' | 'recruiter';

export type AuthScreen = 'login' | 'register' | 'forgot-password';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  rollNo?: string;
  department?: Branch;
  graduationYear?: string;
  companyId?: string;
  companyName?: string;
  designation?: string;
  phone?: string;
  createdAt?: string;
}

export interface DemoAccount {
  role: UserRole;
  roleLabel: string;
  name: string;
  email: string;
  password: string;
  badge: string;
  description: string;
  associatedId?: string;
  rollNo?: string;
  companyName?: string;
  designation?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  branch: Branch;
  batch: string;
  cgpa: number;
  backlogs: number;
  skills: string[];
  placementStatus: PlacementStatus;
  placedCompanyId?: string;
  placedCompanyName?: string;
  placedJobTitle?: string;
  packageLpa?: number;
  avatarSeed?: string;
  gender: 'Male' | 'Female' | 'Other';
  linkedIn?: string;
  github?: string;
  resumeUrl?: string;
  resumeFileName?: string;
  resumeUploadDate?: string;
  resumeFileSize?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  website: string;
  headquarters: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  hiringQuota: number;
  totalHired: number;
  visitDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  about: string;
  logoInitial: string;
  color: string;
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  department: string;
  ctcLpa: number;
  category?: 'Regular' | 'Dream' | 'Marquee';
  minCgpa: number;
  allowedBacklogs: number;
  eligibleBranches: Branch[];
  graduationYears: string[]; // e.g. ['2025', '2026']
  openings: number;
  deadline: string;
  driveDate: string;
  location: string;
  type: 'Full-time' | 'Internship + PPO';
  description: string;
  skillsRequired: string[];
  status: 'Open' | 'Closed' | 'Draft' | 'Upcoming';
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  studentBranch: Branch;
  studentCgpa: number;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  appliedDate: string;
  status: ApplicationStatus;
  currentRound: string;
  remarks?: string;
  interviewDate?: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  companyId: string;
  companyName: string;
  jobId: string;
  jobTitle: string;
  roundTitle: string; // e.g., "Round 1: DSA & Coding", "Round 2: System Design", "Round 3: HR"
  date: string;
  time: string;
  mode: 'Online Meet' | 'Campus Room 301' | 'Campus Room 302' | 'Auditorium A';
  meetingLink?: string;
  panelist: string;
  status: 'Scheduled' | 'Completed' | 'Shortlisted' | 'Rejected' | 'Rescheduled';
  feedback?: string;
}

export interface OfferResult {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  studentBranch: Branch;
  companyId: string;
  companyName: string;
  jobId: string;
  jobTitle: string;
  ctcLpa: number;
  offerDate: string;
  status: 'Accepted' | 'Pending Verification' | 'Declined';
  acceptanceDeadline: string;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'students' 
  | 'companies' 
  | 'jobs' 
  | 'applications' 
  | 'eligibility' 
  | 'interviews' 
  | 'results' 
  | 'reports';
