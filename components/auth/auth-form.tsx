"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  KeyRound,
  Zap,
} from "lucide-react";
import { LEGAL_COMPANY_INFO } from "@/data/policies";

interface AuthFormProps {
  initialMode?: "signin" | "signup";
}

export function AuthForm({ initialMode = "signin" }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // State handling
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Sync mode with query param if present
  useEffect(() => {
    const queryMode = searchParams.get("mode");
    if (queryMode === "signup" || queryMode === "signin") {
      setMode(queryMode);
    }
  }, [searchParams]);

  // Prevent browser autofill from prepopulating fields on initial visit
  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setRememberMe(false);
    setAgreedToTerms(false);
  }, [mode]);

  // Calculate password strength for sign up
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: "", color: "bg-slate-200" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, text: "Weak", color: "bg-rose-500" };
    if (score === 2 || score === 3) return { score: 2, text: "Good", color: "bg-amber-500" };
    return { score: 3, text: "Strong", color: "bg-emerald-500" };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic Validations
    if (!email || !email.includes("@")) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (mode === "signup") {
      if (!fullName.trim()) {
        setErrorMessage("Please enter your full name.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      if (!agreedToTerms) {
        setErrorMessage("You must agree to the Terms of Service and Privacy Policy to continue.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5009";
      const endpoint = mode === "signup"
        ? `${backendUrl}/landing/auth/signup`
        : `${backendUrl}/landing/auth/login`;

      const payload = mode === "signup"
        ? {
            fullName: fullName.trim(),
            email: email.trim(),
            password,
            confirmPassword,
            agreeToTerms: agreedToTerms,
          }
        : {
            email: email.trim(),
            password,
            rememberMe,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.status === "failed") {
        setErrorMessage(data.message || "Authentication failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Normalize and persist user session across ToolOn & Email Automation software
      const userObj = data.user || {
        userId: data.userId || "USR-1",
        email: data.email || email.trim(),
        name: data.name || (email.trim().split("@")[0]),
        role: data.role || "ADMIN",
      };

      const resolvedName = userObj.name || (userObj.email ? userObj.email.split("@")[0] : "User");
      const normalizedProfile = {
        id: userObj.userId || userObj.id || "USR-1",
        userId: userObj.userId || userObj.id || "USR-1",
        name: resolvedName,
        email: userObj.email || email.trim(),
        role: userObj.role || data.role || "ADMIN",
        phone: userObj.phone || "",
        avatarUrl: userObj.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userObj.email || "User")}`,
        unreadNotifications: 0,
        unreadMessages: 0,
      };

      const tokenValue = data.token || data.jwtToken || "authenticated-session";

      // Store in localStorage for ToolOn Landing Page
      localStorage.setItem("toolon_user", JSON.stringify(normalizedProfile));
      localStorage.setItem("toolon_token", tokenValue);

      // Store in standard keys matching Email Automation software
      localStorage.setItem("user_profile", JSON.stringify(normalizedProfile));
      localStorage.setItem("token", tokenValue);
      localStorage.setItem("jwtToken", tokenValue);

      // Dispatch global event for instant navbar & component reactivity
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("toolon-auth-change"));
      }

      const redirectTo = searchParams.get("redirect");

      if (mode === "signin") {
        setSuccessMessage(
          redirectTo === "email-automation"
            ? "Authenticated! Transferring to Email Automation Dashboard..."
            : "Welcome back! Redirecting you to ToolOn..."
        );
      } else {
        setSuccessMessage("Account created successfully! Welcome to ToolOn.");
      }

      setTimeout(() => {
        if (redirectTo === "email-automation") {
          const ssoPayload = btoa(unescape(encodeURIComponent(JSON.stringify({ user_profile: normalizedProfile, token: tokenValue }))));
          const softwareUrl = process.env.NEXT_PUBLIC_SOFTWARE_URL || "http://localhost:3001";
          window.location.href = `${softwareUrl}/dashboard?sso=${ssoPayload}`;
        } else {
          router.push("/");
        }
      }, 1000);
    } catch (err: any) {
      setErrorMessage("Unable to connect to authentication server. Please verify the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5009";
      const response = await fetch(`${backendUrl}/landing/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await response.json();
      if (!response.ok || data.status === "failed") {
        setErrorMessage(data.message || "Failed to dispatch reset instructions.");
        return;
      }
      setResetEmailSent(true);
      setSuccessMessage(data.message || `Password reset OTP has been dispatched to ${email}. Please enter the OTP code below.`);
    } catch (err) {
      setErrorMessage("Unable to connect to recovery server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanOtp = resetOtp.trim().replace(/\D/g, "");
    if (!cleanOtp) {
      setErrorMessage("Please enter the OTP code sent to your email.");
      return;
    }

    const parsedOtp = parseInt(cleanOtp, 10);
    if (isNaN(parsedOtp)) {
      setErrorMessage("Invalid OTP code. Please enter numeric digits.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5009";
      const response = await fetch(`${backendUrl}/landing/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: parsedOtp,
          newPassword: newPassword,
          confirmPassword: confirmNewPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.status === "failed") {
        setErrorMessage(data.message || "Failed to reset password. Please check your OTP code.");
        return;
      }

      setSuccessMessage(data.message || "Password changed successfully! Redirecting to Sign In...");
      setTimeout(() => {
        setIsForgotPassword(false);
        setResetEmailSent(false);
        setResetOtp("");
        setPassword("");
        setConfirmPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setMode("signin");
        setSuccessMessage("Password reset successfully! You can now sign in with your new password.");
      }, 1500);
    } catch (err) {
      setErrorMessage("Unable to connect to password reset server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Col: Interactive Auth Form Card (Span 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            
            {/* Top Back Link & Segmented Mode Switcher */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Tools</span>
              </Link>

              {/* Segmented Tab Toggle */}
              {!isForgotPassword && (
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      mode === "signin"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      mode === "signup"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Header Title */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {isForgotPassword
                  ? (resetEmailSent ? "Set New Password" : "Reset Your Password")
                  : mode === "signin"
                  ? "Sign in to ToolOn"
                  : "Create Your Account"}
              </h1>
              <p className="text-sm text-slate-500 mt-1.5">
                {isForgotPassword
                  ? (resetEmailSent
                      ? "Enter the OTP verification code sent to your email and create your new password."
                      : "Enter your email address to receive password recovery instructions.")
                  : mode === "signin"
                  ? "Access your high-speed image converters, PDF tools, and saved preferences."
                  : "Start using free unlimited online file & image tools today."}
              </p>
            </div>

            {/* Error Notification Alert */}
            {errorMessage && (
              <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Notification Alert */}
            {successMessage && (
              <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Forgot Password Flow */}
            {isForgotPassword ? (
              !resetEmailSent ? (
                /* Step 1: Enter Email to receive OTP */
                <form onSubmit={handleForgotPassword} autoComplete="off" className="space-y-4">
                  <div>
                    <label htmlFor="reset-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="reset-email"
                        name="toolon_reset_email"
                        type="email"
                        autoComplete="off"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        required
                        readOnly
                        onFocus={(e) => { e.target.readOnly = false; }}
                        onClick={(e) => { (e.target as HTMLInputElement).readOnly = false; }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. name@company.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-brand hover:opacity-95 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isLoading ? (
                      <span>Sending OTP Code...</span>
                    ) : (
                      <span>Send Password Reset OTP</span>
                    )}
                  </button>

                  <div className="text-center pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setResetEmailSent(false);
                        setResetOtp("");
                        setNewPassword("");
                        setConfirmNewPassword("");
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      className="text-xs font-semibold text-[#0070F3] hover:underline cursor-pointer"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: Input OTP & Set New Password */
                <form onSubmit={handleResetPassword} autoComplete="off" className="space-y-4">
                  {/* Explicit username reference for browser password managers */}
                  <input
                    type="email"
                    name="username"
                    value={email}
                    readOnly
                    tabIndex={-1}
                    autoComplete="username"
                    className="sr-only opacity-0 pointer-events-none absolute h-0 w-0"
                    aria-hidden="true"
                  />

                  {/* Email summary badge with option to change email */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 truncate mr-2">
                      <Mail className="h-4 w-4 text-[#0070F3] shrink-0" />
                      <span className="truncate">
                        Code sent to: <strong className="text-slate-900 font-semibold">{email}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmailSent(false);
                        setResetOtp("");
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      className="text-[#0070F3] font-bold hover:underline cursor-pointer shrink-0"
                    >
                      Change
                    </button>
                  </div>

                  {/* OTP Input Field */}
                  <div>
                    <label htmlFor="reset-otp" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      OTP Verification Code
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="reset-otp"
                        name="toolon_reset_otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={8}
                        required
                        readOnly
                        onFocus={(e) => { e.target.readOnly = false; }}
                        onClick={(e) => { (e.target as HTMLInputElement).readOnly = false; }}
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value)}
                        placeholder="Enter OTP from your email"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 font-mono tracking-widest text-base placeholder:tracking-normal placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  {/* New Password Field */}
                  <div>
                    <label htmlFor="new-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="new-password"
                        name="toolon_new_password"
                        type={showNewPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        minLength={6}
                        readOnly
                        onFocus={(e) => { e.target.readOnly = false; }}
                        onClick={(e) => { (e.target as HTMLInputElement).readOnly = false; }}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        tabIndex={-1}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password Field */}
                  <div>
                    <label htmlFor="confirm-new-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="confirm-new-password"
                        name="toolon_confirm_new_password"
                        type={showConfirmNewPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        minLength={6}
                        readOnly
                        onFocus={(e) => { e.target.readOnly = false; }}
                        onClick={(e) => { (e.target as HTMLInputElement).readOnly = false; }}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        tabIndex={-1}
                      >
                        {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-brand hover:opacity-95 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isLoading ? <span>Updating Password...</span> : <span>Reset &amp; Save Password</span>}
                  </button>

                  <div className="flex items-center justify-between pt-3 text-xs">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleForgotPassword()}
                      className="font-semibold text-slate-600 hover:text-[#0070F3] cursor-pointer"
                    >
                      Didn't receive code? <span className="text-[#0070F3] font-bold">Resend OTP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setResetEmailSent(false);
                        setResetOtp("");
                        setNewPassword("");
                        setConfirmNewPassword("");
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      className="font-semibold text-[#0070F3] hover:underline cursor-pointer"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              )
            ) : (
              /* Main Sign In & Sign Up Form */
              <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
                {/* Hidden honeypot dummy inputs to absorb aggressive browser password manager autofill */}
                <input
                  type="text"
                  name="fake_username_remember"
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                  className="sr-only opacity-0 h-0 w-0 absolute pointer-events-none"
                />
                <input
                  type="password"
                  name="fake_password_remember"
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="new-password"
                  className="sr-only opacity-0 h-0 w-0 absolute pointer-events-none"
                />
                
                {/* Full Name field (Sign Up only) */}
                {mode === "signup" && (
                  <div>
                    <label htmlFor="fullname" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="fullname"
                        name="toolon_user_fullname"
                        type="text"
                        autoComplete="off"
                        required
                        readOnly
                        onFocus={(e) => { e.target.readOnly = false; }}
                        onClick={(e) => { (e.target as HTMLInputElement).readOnly = false; }}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label htmlFor="auth-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="auth-email"
                      name="toolon_account_email"
                      type="email"
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      required
                      readOnly
                      onFocus={(e) => { e.target.readOnly = false; }}
                      onClick={(e) => { (e.target as HTMLInputElement).readOnly = false; }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@company.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="auth-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setResetEmailSent(false);
                          setResetOtp("");
                          setNewPassword("");
                          setConfirmNewPassword("");
                          setErrorMessage("");
                          setSuccessMessage("");
                        }}
                        className="text-xs font-medium text-[#0070F3] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="auth-password"
                      name="toolon_account_password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      required
                      readOnly
                      onFocus={(e) => { e.target.readOnly = false; }}
                      onClick={(e) => { (e.target as HTMLInputElement).readOnly = false; }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g. Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator (Sign Up) */}
                  {mode === "signup" && password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Password strength:</span>
                        <span className="font-semibold text-slate-700">{passwordStrength.text}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 ${passwordStrength.score >= 1 ? passwordStrength.color : "bg-slate-200"} rounded-full`} />
                        <div className={`h-full flex-1 ${passwordStrength.score >= 2 ? passwordStrength.color : "bg-slate-200"} rounded-full`} />
                        <div className={`h-full flex-1 ${passwordStrength.score >= 3 ? passwordStrength.color : "bg-slate-200"} rounded-full`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password (Sign Up only) */}
                {mode === "signup" && (
                  <div>
                    <label htmlFor="confirm-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="confirm-password"
                        name="toolon_account_confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        required
                        readOnly
                        onFocus={(e) => { e.target.readOnly = false; }}
                        onClick={(e) => { (e.target as HTMLInputElement).readOnly = false; }}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="e.g. Re-enter your password"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0070F3] focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember Me (Sign In) or Terms Agreement (Sign Up) */}
                {mode === "signin" ? (
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-[#0070F3] focus:ring-[#0070F3]"
                      />
                      <span>Remember this browser for 30 days</span>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      id="terms-check"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#0070F3] focus:ring-[#0070F3] mt-0.5"
                    />
                    <label htmlFor="terms-check" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" target="_blank" className="text-[#0070F3] font-semibold hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and acknowledge the{" "}
                      <Link href="/privacy" target="_blank" className="text-[#0070F3] font-semibold hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </label>
                  </div>
                )}

                {/* Submit Primary CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-brand hover:opacity-95 shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>{mode === "signin" ? "Sign In to ToolOn" : "Create Free Account"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Button (Google) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                      setSuccessMessage("Google authentication authorized. Redirecting...");
                      setTimeout(() => router.push("/"), 1200);
                    }, 800);
                  }}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>
            )}

          </div>

          {/* Bottom Switcher Prompt */}
          {!isForgotPassword && (
            <div className="mt-8 pt-5 border-t border-slate-100 text-center text-sm text-slate-600">
              {mode === "signin" ? (
                <p>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="font-bold text-[#0070F3] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Sign up for free</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className="font-bold text-[#0070F3] hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Sign in here</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Brand Perks & Trust Card (Span 5) */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-[#07152B] via-[#0A1F3F] to-[#040C1A] p-8 sm:p-10 text-white flex flex-col justify-between shadow-xl relative overflow-hidden border border-[#1C3A6B]">
          
          {/* Ambient Lighting Spans */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#0070F3]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#F59E0B]/15 blur-3xl" />

          <div className="relative z-10 space-y-6">
            
            {/* ToolOn Brand Header */}
            <div className="inline-block px-3.5 py-2 bg-white rounded-xl shadow-md border border-white/30">
              <Image
                src="/toolon-logo.png"
                alt="ToolOn.in"
                width={200}
                height={60}
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#38BDF8] bg-[#0070F3]/15 border border-[#0070F3]/30 px-3 py-1 rounded-full">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>All-in-One Utility Platform</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Power your workflow with browser-native tools.
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Resize, compress, crop, and convert files with zero quality loss and immediate client-side performance.
              </p>
            </div>

            {/* Value Proposition Bullet Matrix */}
            <div className="space-y-3.5 pt-2">
              {[
                {
                  title: "100% Client-Side Processing",
                  desc: "Your files never leave your device for core image and PDF tasks.",
                  icon: ShieldCheck,
                  iconColor: "text-emerald-400",
                  bgColor: "bg-emerald-500/10 border-emerald-500/20",
                },
                {
                  title: "Instant Conversions",
                  desc: "Zero queues or upload wait times powered by WebAssembly.",
                  icon: Zap,
                  iconColor: "text-amber-400",
                  bgColor: "bg-amber-500/10 border-amber-500/20",
                },
                {
                  title: "Single Credential Access",
                  desc: "Sync preferences across PDF tools, image compressors, and format converters.",
                  icon: KeyRound,
                  iconColor: "text-sky-400",
                  bgColor: "bg-sky-500/10 border-sky-500/20",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${item.bgColor}`}>
                    <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Legal Compliance Footer Tag */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/[0.08] text-xs text-slate-400 space-y-1">
            <p>
              Operated by <strong className="text-white font-medium">{LEGAL_COMPANY_INFO.legalName}</strong>
            </p>
            <p className="font-mono text-[11px] text-slate-400">
              CIN: {LEGAL_COMPANY_INFO.cin} • Indian DPDP Compliant
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
