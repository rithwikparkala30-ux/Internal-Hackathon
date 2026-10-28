import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Student, 
  Company, 
  Job, 
  Application, 
  Interview, 
  OfferResult, 
  UserRole, 
  ActiveTab, 
  ApplicationStatus 
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_COMPANIES, 
  INITIAL_JOBS, 
  INITIAL_APPLICATIONS, 
  INITIAL_INTERVIEWS, 
  INITIAL_OFFERS 
} from '../data/mockData';
import {
  AuthUser,
  AuthScreen,
  Branch
} from '../types';
import {
  DEMO_ACCOUNTS,
  getRegisteredAccounts,
  saveRegisteredAccount,
  getStoredSession,
  setStoredSession,
  setRememberedEmail,
  getRememberedEmail
} from '../data/authData';

export const ROLE_PERMISSIONS: Record<UserRole, ActiveTab[]> = {
  admin: [
    'dashboard',
    'students',
    'companies',
    'jobs',
    'applications',
    'eligibility',
    'interviews',
    'results',
    'reports',
  ],
  student: [
    'dashboard',
    'jobs',
    'applications',
    'eligibility',
    'interviews',
    'results',
  ],
  recruiter: [
    'dashboard',
    'students',
    'jobs',
    'applications',
    'interviews',
    'results',
  ],
};

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  title: string;
  message: string;
}

interface PlacementContextType {
  // Authentication & Session
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  authScreen: AuthScreen;
  setAuthScreen: (screen: AuthScreen) => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    rollNo?: string;
    department?: Branch;
    graduationYear?: string;
    companyName?: string;
    designation?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string, newPassword?: string) => Promise<{ success: boolean; message: string }>;
  switchDemoRole: (role: UserRole) => void;
  isTabAllowed: (tab: ActiveTab, roleToCheck?: UserRole) => boolean;

  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  activeCompanyId: string;
  setActiveCompanyId: (id: string) => void;
  
  students: Student[];
  companies: Company[];
  jobs: Job[];
  applications: Application[];
  interviews: Interview[];
  offers: OfferResult[];
  
  // Student actions
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  uploadResume: (studentId: string, fileName: string, fileSize: string) => void;
  removeResume: (studentId: string) => void;
  
  // Company actions
  addCompany: (company: Omit<Company, 'id' | 'totalHired'>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  
  // Job actions
  addJob: (job: Omit<Job, 'id'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  
  // Application actions
  applyForJob: (studentId: string, jobId: string) => boolean;
  withdrawApplication: (applicationId: string) => void;
  updateApplicationStatus: (applicationId: string, status: ApplicationStatus, currentRound?: string, remarks?: string) => void;
  bulkApplyOrShortlist: (jobId: string, studentIds: string[], targetStatus: ApplicationStatus) => number;
  
  // Interview actions
  scheduleInterview: (interview: Omit<Interview, 'id'>) => void;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;

  // Offer actions
  updateOfferOutcome: (offerId: string, status: 'Accepted' | 'Pending Verification' | 'Declined') => void;
  
  // System actions
  resetToDemoData: () => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (type: 'success' | 'info' | 'error' | 'warning', title: string, message: string) => void;
}

const STORAGE_KEY = 'campus_connect_v1_store';

const PlacementContext = createContext<PlacementContextType | undefined>(undefined);

export const PlacementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return getStoredSession();
  });
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  const [role, setRoleState] = useState<UserRole>(() => {
    const session = getStoredSession();
    return session ? session.role : 'admin';
  });

  const [activeTab, setActiveTabState] = useState<ActiveTab>('dashboard');
  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    const session = getStoredSession();
    return session?.studentId || 'std-004';
  });
  const [activeCompanyId, setActiveCompanyId] = useState<string>(() => {
    const session = getStoredSession();
    return session?.companyId || 'comp-001';
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const isTabAllowed = (tab: ActiveTab, roleToCheck?: UserRole): boolean => {
    const r = roleToCheck || (currentUser ? currentUser.role : role);
    return ROLE_PERMISSIONS[r]?.includes(tab) ?? false;
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (currentUser) {
      const updatedUser = { ...currentUser, role: newRole };
      setCurrentUser(updatedUser);
      setStoredSession(updatedUser);
    }
  };

  const setActiveTab = (tab: ActiveTab) => {
    const currentRole = currentUser ? currentUser.role : role;
    if (!ROLE_PERMISSIONS[currentRole]?.includes(tab)) {
      showToast(
        'warning',
        'Access Restricted',
        `Your ${currentRole.toUpperCase()} account is not authorized to view the ${tab} section.`
      );
      setActiveTabState('dashboard');
      return;
    }
    setActiveTabState(tab);
  };

  // State slices
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_companies`);
      return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
    } catch {
      return INITIAL_COMPANIES;
    }
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_jobs`);
      if (saved) {
        const parsed = JSON.parse(saved) as Job[];
        return parsed.map((j) => ({
          ...j,
          graduationYears: j.graduationYears && j.graduationYears.length > 0 ? j.graduationYears : ['2025'],
        }));
      }
      return INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_applications`);
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [interviews, setInterviews] = useState<Interview[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_interviews`);
      return saved ? JSON.parse(saved) : INITIAL_INTERVIEWS;
    } catch {
      return INITIAL_INTERVIEWS;
    }
  });

  const [offers, setOffers] = useState<OfferResult[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_offers`);
      return saved ? JSON.parse(saved) : INITIAL_OFFERS;
    } catch {
      return INITIAL_OFFERS;
    }
  });

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_companies`, JSON.stringify(companies));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [companies]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(jobs));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_applications`, JSON.stringify(applications));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_interviews`, JSON.stringify(interviews));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [interviews]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_offers`, JSON.stringify(offers));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [offers]);

  const showToast = (type: 'success' | 'info' | 'error' | 'warning', title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Student Actions
  const addStudent = (newStudentData: Omit<Student, 'id'>) => {
    const newId = `std-${Date.now().toString().slice(-4)}`;
    const student: Student = {
      ...newStudentData,
      id: newId,
    };
    setStudents((prev) => [student, ...prev]);
    showToast('success', 'Student Added', `${student.name} (${student.rollNo}) has been registered.`);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    showToast('info', 'Student Updated', 'Student profile details were successfully updated.');
  };

  const deleteStudent = (id: string) => {
    const student = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setApplications((prev) => prev.filter((a) => a.studentId !== id));
    setInterviews((prev) => prev.filter((i) => i.studentId !== id));
    showToast('warning', 'Student Removed', student ? `${student.name} was removed from records.` : 'Student deleted.');
  };

  const uploadResume = (studentId: string, fileName: string, fileSize: string) => {
    const uploadDate = new Date().toISOString().split('T')[0];
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              resumeFileName: fileName,
              resumeFileSize: fileSize,
              resumeUploadDate: uploadDate,
              resumeUrl: `#resume-${studentId}`,
            }
          : s
      )
    );
    showToast('success', 'Resume Uploaded', `File "${fileName}" saved to student profile.`);
  };

  const removeResume = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              resumeFileName: undefined,
              resumeFileSize: undefined,
              resumeUploadDate: undefined,
              resumeUrl: undefined,
            }
          : s
      )
    );
    showToast('info', 'Resume Removed', 'Resume document removed from student profile.');
  };

  // Company Actions
  const addCompany = (newCompanyData: Omit<Company, 'id' | 'totalHired'>) => {
    const newId = `comp-${Date.now().toString().slice(-4)}`;
    const company: Company = {
      ...newCompanyData,
      id: newId,
      totalHired: 0,
    };
    setCompanies((prev) => [...prev, company]);
    showToast('success', 'Company Registered', `${company.name} added to recruiting directory.`);
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('info', 'Company Updated', 'Recruiter organization details updated.');
  };

  const deleteCompany = (id: string) => {
    const comp = companies.find((c) => c.id === id);
    setCompanies((prev) => prev.filter((c) => c.id !== id));
    setJobs((prev) => prev.filter((j) => j.companyId !== id));
    setApplications((prev) => prev.filter((a) => a.companyId !== id));
    setInterviews((prev) => prev.filter((i) => i.companyId !== id));
    showToast('warning', 'Company Removed', comp ? `${comp.name} and related records removed.` : 'Company deleted.');
  };

  // Job Actions
  const addJob = (newJobData: Omit<Job, 'id'>) => {
    const newId = `job-${Date.now().toString().slice(-4)}`;
    const job: Job = {
      ...newJobData,
      graduationYears: newJobData.graduationYears && newJobData.graduationYears.length > 0 ? newJobData.graduationYears : ['2025'],
      id: newId,
    };
    setJobs((prev) => [job, ...prev]);
    showToast('success', 'Job Posted', `New opening "${job.title}" posted for ${job.companyName}.`);
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...updates } : j))
    );
    showToast('info', 'Job Updated', 'Job requirements and details updated.');
  };

  const deleteJob = (id: string) => {
    const job = jobs.find((j) => j.id === id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setApplications((prev) => prev.filter((a) => a.jobId !== id));
    setInterviews((prev) => prev.filter((i) => i.jobId !== id));
    showToast('warning', 'Job Removed', job ? `Position "${job.title}" deleted.` : 'Job deleted.');
  };

  // Application Actions
  const withdrawApplication = (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    setApplications((prev) => prev.filter((a) => a.id !== applicationId));
    showToast('info', 'Application Withdrawn', app ? `Withdrew application for ${app.jobTitle}.` : 'Application withdrawn.');
  };

  // Application Actions
  const applyForJob = (studentId: string, jobId: string): boolean => {
    const student = students.find((s) => s.id === studentId);
    const job = jobs.find((j) => j.id === jobId);

    if (!student || !job) {
      showToast('error', 'Application Failed', 'Invalid student or job reference.');
      return false;
    }

    // Check duplicate
    const existing = applications.find(
      (a) => a.studentId === studentId && a.jobId === jobId
    );
    if (existing) {
      showToast('warning', 'Already Applied', `You have already applied for ${job.title} at ${job.companyName}.`);
      return false;
    }

    const newApp: Application = {
      id: `app-${Date.now().toString().slice(-4)}`,
      studentId: student.id,
      studentName: student.name,
      studentRollNo: student.rollNo,
      studentBranch: student.branch,
      studentCgpa: student.cgpa,
      jobId: job.id,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.companyName,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      currentRound: 'Application Submitted',
      remarks: 'Application submitted via student portal.',
    };

    setApplications((prev) => [newApp, ...prev]);
    showToast('success', 'Application Submitted', `Application sent for ${job.title} at ${job.companyName}.`);
    return true;
  };

  const updateApplicationStatus = (
    applicationId: string, 
    status: ApplicationStatus, 
    currentRound?: string, 
    remarks?: string
  ) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === applicationId) {
          return {
            ...a,
            status,
            currentRound: currentRound || a.currentRound,
            remarks: remarks !== undefined ? remarks : a.remarks,
          };
        }
        return a;
      })
    );

    // If status became Offered, synchronize with student placementStatus and offers registry
    if (status === 'Offered') {
      const job = jobs.find((j) => j.id === app.jobId);
      const pkg = job?.ctcLpa || 15.0;

      // Update student
      setStudents((prev) =>
        prev.map((s) =>
          s.id === app.studentId
            ? {
                ...s,
                placementStatus: 'Placed',
                placedCompanyId: app.companyId,
                placedCompanyName: app.companyName,
                placedJobTitle: app.jobTitle,
                packageLpa: pkg,
              }
            : s
        )
      );

      // Add to offers list if not already present
      setOffers((prev) => {
        const alreadyHasOffer = prev.some(
          (o) => o.studentId === app.studentId && o.jobId === app.jobId
        );
        if (alreadyHasOffer) return prev;
        const newOffer: OfferResult = {
          id: `off-${Date.now().toString().slice(-4)}`,
          studentId: app.studentId,
          studentName: app.studentName,
          studentRollNo: app.studentRollNo,
          studentBranch: app.studentBranch,
          companyId: app.companyId,
          companyName: app.companyName,
          jobId: app.jobId,
          jobTitle: app.jobTitle,
          ctcLpa: pkg,
          offerDate: new Date().toISOString().split('T')[0],
          status: 'Accepted',
          acceptanceDeadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        };
        return [newOffer, ...prev];
      });

      // Update company totalHired counter
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === app.companyId ? { ...c, totalHired: c.totalHired + 1 } : c
        )
      );
    }

    showToast('info', 'Status Updated', `${app.studentName}'s application set to "${status}".`);
  };

  const bulkApplyOrShortlist = (jobId: string, studentIds: string[], targetStatus: ApplicationStatus): number => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return 0;

    let count = 0;
    const newApps: Application[] = [];

    studentIds.forEach((sid) => {
      const student = students.find((s) => s.id === sid);
      if (!student) return;

      const existing = applications.find(
        (a) => a.studentId === sid && a.jobId === jobId
      );

      if (existing) {
        // Update existing application
        setApplications((prev) =>
          prev.map((a) =>
            a.id === existing.id
              ? {
                  ...a,
                  status: targetStatus,
                  currentRound: targetStatus === 'Shortlisted' ? 'Screening Passed' : a.currentRound,
                }
              : a
          )
        );
        count++;
      } else {
        // Create new
        newApps.push({
          id: `app-${Date.now().toString().slice(-4)}-${count}`,
          studentId: student.id,
          studentName: student.name,
          studentRollNo: student.rollNo,
          studentBranch: student.branch,
          studentCgpa: student.cgpa,
          jobId: job.id,
          jobTitle: job.title,
          companyId: job.companyId,
          companyName: job.companyName,
          appliedDate: new Date().toISOString().split('T')[0],
          status: targetStatus,
          currentRound: targetStatus === 'Shortlisted' ? 'Direct Shortlist' : 'Application Submitted',
          remarks: 'Action processed via batch eligibility manager.',
        });
        count++;
      }
    });

    if (newApps.length > 0) {
      setApplications((prev) => [...newApps, ...prev]);
    }

    showToast('success', 'Batch Action Complete', `${count} eligible candidates marked as "${targetStatus}".`);
    return count;
  };

  // Interview actions
  const scheduleInterview = (interviewData: Omit<Interview, 'id'>) => {
    const newId = `int-${Date.now().toString().slice(-4)}`;
    const newInterview: Interview = {
      ...interviewData,
      id: newId,
    };
    setInterviews((prev) => [newInterview, ...prev]);

    // Also update associated application status if needed
    if (newInterview.applicationId) {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === newInterview.applicationId
            ? {
                ...a,
                status: 'Interview Scheduled',
                currentRound: newInterview.roundTitle,
                interviewDate: `${newInterview.date} ${newInterview.time}`,
              }
            : a
        )
      );
    }

    showToast(
      'success',
      'Interview Scheduled',
      `${newInterview.roundTitle} scheduled with ${newInterview.studentName}.`
    );
  };

  const updateInterview = (id: string, updates: Partial<Interview>) => {
    setInterviews((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
    showToast('info', 'Interview Updated', 'Interview record has been updated.');
  };

  const deleteInterview = (id: string) => {
    setInterviews((prev) => prev.filter((i) => i.id !== id));
    showToast('warning', 'Interview Cancelled', 'Interview slot removed from schedule.');
  };

  // Offer actions
  const updateOfferOutcome = (offerId: string, status: 'Accepted' | 'Pending Verification' | 'Declined') => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status } : o))
    );

    if (status === 'Declined') {
      // Revert student placement status if no other active accepted offer
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === offer.studentId) {
            return {
              ...s,
              placementStatus: 'In Process',
              packageLpa: undefined,
              placedCompanyId: undefined,
              placedCompanyName: undefined,
              placedJobTitle: undefined,
            };
          }
          return s;
        })
      );

      // Decrement company hired count
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === offer.companyId ? { ...c, totalHired: Math.max(0, c.totalHired - 1) } : c
        )
      );

      showToast('warning', 'Offer Declined', `${offer.studentName} marked as declined offer from ${offer.companyName}.`);
    } else {
      showToast('info', 'Offer Updated', `Offer status updated to "${status}".`);
    }
  };

  // Authentication actions
  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check in DEMO_ACCOUNTS
    const demo = DEMO_ACCOUNTS.find(
      (d) => d.email.toLowerCase() === cleanEmail
    );

    if (demo && demo.password === password) {
      const user: AuthUser = {
        id: demo.associatedId || `user-${demo.role}`,
        name: demo.name,
        email: demo.email,
        role: demo.role,
        studentId: demo.role === 'student' ? (demo.associatedId || 'std-004') : undefined,
        rollNo: demo.rollNo,
        department: demo.role === 'student' ? 'Computer Science' : undefined,
        graduationYear: demo.role === 'student' ? '2025' : undefined,
        companyId: demo.role === 'recruiter' ? (demo.associatedId || 'comp-001') : undefined,
        companyName: demo.companyName,
        designation: demo.designation,
      };

      setCurrentUser(user);
      setRoleState(user.role);
      if (user.studentId) setActiveStudentId(user.studentId);
      if (user.companyId) setActiveCompanyId(user.companyId);
      setStoredSession(user);
      setRememberedEmail(user.email, rememberMe);
      setActiveTabState('dashboard');
      showToast('success', `Welcome back, ${user.name}!`, `Authenticated as ${user.role.toUpperCase()}`);
      return { success: true };
    }

    // 2. Check registered accounts in localStorage
    const registered = getRegisteredAccounts();
    const found = registered.find(
      (acc) => acc.user.email.toLowerCase() === cleanEmail
    );

    if (found && found.passwordHash === password) {
      setCurrentUser(found.user);
      setRoleState(found.user.role);
      if (found.user.studentId) setActiveStudentId(found.user.studentId);
      if (found.user.companyId) setActiveCompanyId(found.user.companyId);
      setStoredSession(found.user);
      setRememberedEmail(found.user.email, rememberMe);
      setActiveTabState('dashboard');
      showToast('success', `Welcome, ${found.user.name}!`, `Logged in as ${found.user.role.toUpperCase()}`);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid email address or password. Please re-check your credentials or select a Demo Account below to test.',
    };
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    rollNo?: string;
    department?: Branch;
    graduationYear?: string;
    companyName?: string;
    designation?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();

    const demoConflict = DEMO_ACCOUNTS.some((d) => d.email.toLowerCase() === cleanEmail);
    const regConflict = getRegisteredAccounts().some((a) => a.user.email.toLowerCase() === cleanEmail);

    if (demoConflict || regConflict) {
      return { success: false, error: 'An account with this email address is already registered in the system.' };
    }

    let assignedStudentId: string | undefined = undefined;
    if (data.role === 'student') {
      assignedStudentId = `std-${Date.now().toString().slice(-4)}`;
      const newStudent: Student = {
        id: assignedStudentId,
        rollNo: data.rollNo || `21CS${Math.floor(100 + Math.random() * 900)}`,
        name: data.name,
        email: data.email,
        phone: '+91 98112 00000',
        branch: data.department || 'Computer Science',
        batch: data.graduationYear || '2025',
        cgpa: 8.5,
        backlogs: 0,
        skills: ['Python', 'SQL', 'Web Development'],
        placementStatus: 'In Process',
        gender: 'Other',
      };
      setStudents((prev) => [newStudent, ...prev]);
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      studentId: assignedStudentId,
      rollNo: data.rollNo,
      department: data.department,
      graduationYear: data.graduationYear,
      companyName: data.companyName,
      designation: data.designation,
      createdAt: new Date().toISOString(),
    };

    saveRegisteredAccount({
      user: newUser,
      passwordHash: data.password,
    });

    showToast('success', 'Registration Complete', 'Your account has been created. You can now sign in.');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setStoredSession(null);
    setAuthScreen('login');
    setActiveTabState('dashboard');
    showToast('info', 'Signed Out', 'You have been safely signed out of Campus Connect.');
  };

  const resetPassword = async (
    email: string,
    newPassword?: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const demo = DEMO_ACCOUNTS.find((d) => d.email.toLowerCase() === cleanEmail);
    const registered = getRegisteredAccounts();
    const regAccount = registered.find((a) => a.user.email.toLowerCase() === cleanEmail);

    if (!demo && !regAccount) {
      return {
        success: false,
        message: 'No registered user account found with this email address in our directory.',
      };
    }

    if (newPassword && regAccount) {
      regAccount.passwordHash = newPassword;
      saveRegisteredAccount(regAccount);
      return {
        success: true,
        message: 'Password successfully updated! You may now sign in using your new credentials.',
      };
    }

    return {
      success: true,
      message: `Password reset verification instructions simulated for ${email}. You may now enter your new password.`,
    };
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const targetDemo = DEMO_ACCOUNTS.find((d) => d.role === targetRole);
    if (!targetDemo) return;
    const user: AuthUser = {
      id: targetDemo.associatedId || `user-${targetDemo.role}`,
      name: targetDemo.name,
      email: targetDemo.email,
      role: targetDemo.role,
      studentId: targetDemo.role === 'student' ? (targetDemo.associatedId || 'std-004') : undefined,
      rollNo: targetDemo.rollNo,
      department: targetDemo.role === 'student' ? 'Computer Science' : undefined,
      graduationYear: targetDemo.role === 'student' ? '2025' : undefined,
      companyId: targetDemo.role === 'recruiter' ? (targetDemo.associatedId || 'comp-001') : undefined,
      companyName: targetDemo.companyName,
      designation: targetDemo.designation,
    };
    setCurrentUser(user);
    setRoleState(user.role);
    if (user.studentId) setActiveStudentId(user.studentId);
    if (user.companyId) setActiveCompanyId(user.companyId);
    setStoredSession(user);
    if (!ROLE_PERMISSIONS[user.role].includes(activeTab)) {
      setActiveTabState('dashboard');
    }
    showToast('info', 'Switched Persona', `Active session updated to ${targetDemo.roleLabel} (${targetDemo.name})`);
  };

  // System actions
  const resetToDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setCompanies(INITIAL_COMPANIES);
    setJobs(INITIAL_JOBS);
    setApplications(INITIAL_APPLICATIONS);
    setInterviews(INITIAL_INTERVIEWS);
    setOffers(INITIAL_OFFERS);

    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_companies`);
    localStorage.removeItem(`${STORAGE_KEY}_jobs`);
    localStorage.removeItem(`${STORAGE_KEY}_applications`);
    localStorage.removeItem(`${STORAGE_KEY}_interviews`);
    localStorage.removeItem(`${STORAGE_KEY}_offers`);

    showToast('success', 'Reset Complete', 'Demo database restored to default state (20 students, 3 companies).');
  };

  return (
    <PlacementContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        authScreen,
        setAuthScreen,
        login,
        register,
        logout,
        resetPassword,
        switchDemoRole,
        isTabAllowed,
        role,
        setRole,
        activeTab,
        setActiveTab,
        activeStudentId,
        setActiveStudentId,
        activeCompanyId,
        setActiveCompanyId,
        students,
        companies,
        jobs,
        applications,
        interviews,
        offers,
        addStudent,
        updateStudent,
        deleteStudent,
        uploadResume,
        removeResume,
        addCompany,
        updateCompany,
        deleteCompany,
        addJob,
        updateJob,
        deleteJob,
        applyForJob,
        withdrawApplication,
        updateApplicationStatus,
        bulkApplyOrShortlist,
        scheduleInterview,
        updateInterview,
        deleteInterview,
        updateOfferOutcome,
        resetToDemoData,
        toasts,
        dismissToast,
        showToast,
      }}
    >
      {children}
    </PlacementContext.Provider>
  );
};

export const usePlacement = () => {
  const context = useContext(PlacementContext);
  if (!context) {
    throw new Error('usePlacement must be used within a PlacementProvider');
  }
  return context;
};
