import React, { useState } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Branch, UserRole } from '../../types';

export const RegisterView: React.FC = () => {
  const { register, setAuthScreen } = usePlacement();

  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Student specific
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState<Branch>('Computer Science');
  const [graduationYear, setGraduationYear] = useState('2025');

  // Recruiter specific
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');

  // Agreement & Status
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const passwordStrength = getPasswordStrength(password);
  const getStrengthLabel = (score: number) => {
    if (score === 0) return { label: 'Too short', color: 'bg-slate-200 text-slate-500', barWidth: 'w-1/12' };
    if (score === 1) return { label: 'Weak', color: 'bg-rose-500 text-rose-600', barWidth: 'w-1/4' };
    if (score === 2) return { label: 'Fair', color: 'bg-amber-500 text-amber-600', barWidth: 'w-2/4' };
    if (score === 3) return { label: 'Good', color: 'bg-blue-600 text-blue-600', barWidth: 'w-3/4' };
    return { label: 'Strong', color: 'bg-emerald-600 text-emerald-600', barWidth: 'w-full' };
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please provide a valid email format';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (role === 'student') {
      if (!rollNo.trim()) errs.rollNo = 'University roll / student ID is required';
    } else if (role === 'recruiter') {
      if (!companyName.trim()) errs.companyName = 'Company name is required';
      if (!designation.trim()) errs.designation = 'Hiring designation is required';
    }

    if (!agreeTerms) {
      errs.terms = 'You must agree to the institutional recruitment policies & privacy guidelines';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await register({
        name,
        email,
        password,
        role,
        rollNo: role === 'student' ? rollNo : undefined,
        department: role === 'student' ? department : undefined,
        graduationYear: role === 'student' ? graduationYear : undefined,
        companyName: role === 'recruiter' ? companyName : undefined,
        designation: role === 'recruiter' ? designation : undefined,
      });

      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrors({ general: res.error || 'Failed to complete registration.' });
      }
    } catch {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Account Registered Successfully!
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Your {role === 'student' ? 'Student Candidate' : role === 'recruiter' ? 'Recruiter' : 'Placement Staff'} profile for <strong>{name}</strong> ({email}) has been provisioned.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 text-left space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Account Type:</span>
            <span className="font-semibold text-slate-900 capitalize">{role}</span>
          </div>
          {role === 'student' && (
            <>
              <div className="flex justify-between">
                <span className="text-slate-400">Roll Number:</span>
                <span className="font-mono text-slate-900">{rollNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="text-slate-900">{department}</span>
              </div>
            </>
          )}
          {role === 'recruiter' && (
            <div className="flex justify-between">
              <span className="text-slate-400">Company:</span>
              <span className="text-slate-900 font-semibold">{companyName}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setAuthScreen('login')}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Proceed to Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Create Portal Account
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Register with your institutional credentials to enter the placement portal
        </p>
      </div>

      {errors.general && (
        <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errors.general}</div>
        </div>
      )}

      {/* Role Picker Segmented Tab */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Select Registration Category *
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              role === 'student'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('recruiter')}
            className={`py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              role === 'recruiter'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Recruiter</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
              role === 'admin'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
            <span>Staff Admin</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Venkatesh"
              className={`w-full pl-9 pr-3.5 py-2 text-xs bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {role === 'student' ? 'College Email Address *' : 'Work Email Address *'}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'student' ? 'rollno@campus.edu' : 'name@company.com'}
              className={`w-full pl-9 pr-3.5 py-2 text-xs bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
        </div>

        {/* Student Fields */}
        {role === 'student' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Student ID / Roll No *
              </label>
              <input
                type="text"
                required
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                placeholder="21CS105"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Branch)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Tech</option>
                <option value="Electronics & Comm">Electronics & Comm</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Graduation Year *
              </label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="2024">Batch 2024</option>
                <option value="2025">Batch 2025</option>
                <option value="2026">Batch 2026</option>
                <option value="2027">Batch 2027</option>
              </select>
            </div>
            {errors.rollNo && (
              <p className="col-span-full text-[11px] text-rose-600">{errors.rollNo}</p>
            )}
          </div>
        )}

        {/* Recruiter Fields */}
        {role === 'recruiter' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Company / Organization *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Apex Global Technologies"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.companyName && <p className="text-[11px] text-rose-600 mt-1">{errors.companyName}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Hiring Role / Designation *
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Talent Partner"
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.designation && <p className="text-[11px] text-rose-600 mt-1">{errors.designation}</p>}
            </div>
          </div>
        )}

        {/* Passwords Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className={`w-full pl-9 pr-9 py-2 text-xs bg-white border rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-2"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type password"
                className={`w-full pl-9 pr-9 py-2 text-xs bg-white border rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-2"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Password Strength:</span>
              <span className={`font-semibold ${getStrengthLabel(passwordStrength).color}`}>
                {getStrengthLabel(passwordStrength).label}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  passwordStrength <= 1
                    ? 'bg-rose-500 w-1/4'
                    : passwordStrength === 2
                    ? 'bg-amber-500 w-2/4'
                    : passwordStrength === 3
                    ? 'bg-blue-600 w-3/4'
                    : 'bg-emerald-600 w-full'
                }`}
              />
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-0.5">
              <span className={password.length >= 8 ? 'text-emerald-700 font-medium' : ''}>
                ✓ At least 8 characters
              </span>
              <span className={/[0-9]/.test(password) ? 'text-emerald-700 font-medium' : ''}>
                ✓ Includes a number
              </span>
            </div>
          </div>
        )}

        {/* Terms Checkbox */}
        <div>
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
            />
            <span className="text-xs text-slate-600 leading-normal">
              I agree to the <strong>Campus Placement Code of Conduct</strong> and declare all academic/corporate details provided are authentic.
            </span>
          </label>
          {errors.terms && <p className="text-[11px] text-rose-600 mt-1">{errors.terms}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setAuthScreen('login')}
            className="font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Sign In here
          </button>
        </p>
      </div>
    </div>
  );
};
