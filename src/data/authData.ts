import { DemoAccount, AuthUser } from '../types';

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'admin',
    roleLabel: 'Placement Administrator',
    name: 'Dr. Arvind Sundaram',
    email: 'admin@campusconnect.edu',
    password: 'Admin@2025',
    badge: 'Full Oversight',
    description: 'Manage institutional placement policies, approve jobs, evaluate drives & view analytics',
    designation: 'Director of Corporate Relations & Placements',
  },
  {
    role: 'student',
    roleLabel: 'Student Candidate',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@campus.edu',
    password: 'Student@2025',
    associatedId: 'std-004',
    rollNo: '21CS104',
    badge: 'Candidate Portal',
    description: 'Browse campus openings, verify eligibility, track applications & manage resumes',
    designation: 'B.Tech Computer Science · Batch of 2025',
  },
  {
    role: 'recruiter',
    roleLabel: 'Corporate Recruiter',
    name: 'Vikram Malhotra',
    email: 'hr@nexatech.com',
    password: 'Recruiter@2025',
    associatedId: 'comp-001',
    companyName: 'NexaTech Systems',
    badge: 'Hiring Suite',
    description: 'Post job requirements, evaluate student applicants, schedule panels & extend offers',
    designation: 'Lead University Talent Partner',
  },
];

export interface StoredUserAccount {
  user: AuthUser;
  passwordHash: string; // Plaintext or simulated hash for demo
}

const REGISTERED_USERS_KEY = 'campus_connect_v1_registered_users';
const SESSION_USER_KEY = 'campus_connect_v1_auth_session';
const REMEMBER_ME_KEY = 'campus_connect_v1_remembered_email';

export const getRegisteredAccounts = (): StoredUserAccount[] => {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveRegisteredAccount = (account: StoredUserAccount): void => {
  try {
    const current = getRegisteredAccounts();
    const existingIndex = current.findIndex(
      (a) => a.user.email.toLowerCase() === account.user.email.toLowerCase()
    );
    if (existingIndex >= 0) {
      current[existingIndex] = account;
    } else {
      current.push(account);
    }
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Error saving registered account:', err);
  }
};

export const getRememberedEmail = (): string => {
  try {
    return localStorage.getItem(REMEMBER_ME_KEY) || '';
  } catch {
    return '';
  }
};

export const setRememberedEmail = (email: string, remember: boolean): void => {
  try {
    if (remember && email) {
      localStorage.setItem(REMEMBER_ME_KEY, email);
    } else {
      localStorage.removeItem(REMEMBER_ME_KEY);
    }
  } catch (err) {
    console.error('Error setting remembered email:', err);
  }
};

export const getStoredSession = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(SESSION_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredSession = (user: AuthUser | null): void => {
  try {
    if (user) {
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_USER_KEY);
    }
  } catch (err) {
    console.error('Error updating session:', err);
  }
};
