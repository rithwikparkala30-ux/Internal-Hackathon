import React, { useState, useEffect } from 'react';
import { usePlacement } from '../../context/PlacementContext';
import { DEMO_ACCOUNTS, getRememberedEmail } from '../../data/authData';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { UserRole } from '../../types';

export const LoginView: React.FC = () => {
  const { login, setAuthScreen } = usePlacement();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load remembered email if present
  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password, rememberMe);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = async (account: typeof DEMO_ACCOUNTS[0], autoSubmit = false) => {
    setEmail(account.email);
    setPassword(account.password);
    setErrorMessage('');
    if (autoSubmit) {
      setIsLoading(true);
      await login(account.email, account.password, rememberMe);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Sign In to Portal
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Access your centralized Campus Connect recruitment dashboard & pipeline
        </p>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            College / Institutional Email *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g. name@campusconnect.edu"
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Password *
            </label>
            <button
              type="button"
              onClick={() => setAuthScreen('forgot-password')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Enter your account password"
              className="w-full pl-9 pr-10 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-slate-400 hover:text-slate-600 absolute right-2.5 top-2"
              title={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
            />
            <span className="text-xs text-slate-600 font-medium">Remember my email</span>
          </label>
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
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Registration */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          New student candidate or recruiting organization?{' '}
          <button
            type="button"
            onClick={() => setAuthScreen('register')}
            className="font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Create an Account
          </button>
        </p>
      </div>

      {/* DEMO AUTHENTICATION CARDS FOR EVALUATORS */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Demo Test Credentials
          </span>
          <span className="text-[10px] font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200 ml-auto">
            Prototype Evaluation
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          Select any role below to pre-fill credentials and evaluate role-based permissions:
        </p>

        <div className="space-y-2">
          {DEMO_ACCOUNTS.map((acc) => {
            const isSelected = email.toLowerCase() === acc.email.toLowerCase();
            const Icon = 
              acc.role === 'admin' 
                ? ShieldCheck 
                : acc.role === 'student' 
                ? GraduationCap 
                : Building2;

            return (
              <div
                key={acc.role}
                className={`p-3 rounded-xl border text-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    acc.role === 'admin'
                      ? 'bg-slate-900 text-white'
                      : acc.role === 'student'
                      ? 'bg-blue-600 text-white'
                      : 'bg-emerald-700 text-white'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 truncate">
                        {acc.roleLabel}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ({acc.name.split(' ')[0]})
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-slate-600 truncate mt-0.5">
                      {acc.email} · <span className="text-slate-400">pwd:</span> <strong className="text-slate-700">{acc.password}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleQuickFill(acc, false)}
                    className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
                    title="Fill email and password into form"
                  >
                    Fill
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill(acc, true)}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md transition-colors shadow-xs cursor-pointer"
                    title="Instant 1-Click Login"
                  >
                    Quick Login
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-start gap-1.5 text-[10px] text-slate-400 italic">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            Demo authentication runs fully in-browser with simulated sessions. Production deployment uses SSO/SAML/OAuth institutional directory integration.
          </span>
        </div>
      </div>
    </div>
  );
};
