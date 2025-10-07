import React, { useState, ChangeEvent, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, User, Lock, LogIn } from "lucide-react";
import styles from "./LoginPage.module.css";

interface FormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { login, loginAsGuest, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Redirect jika sudah login
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error saat user mulai mengetik
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!formData.username || !formData.password) {
      setError("Username dan password harus diisi");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData.username, formData.password);
      if (!result.success) {
        setError(result.error || "Terjadi kesalahan saat login");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login");
    }

    setIsSubmitting(false);
  };

  const handleGuestLogin = (): void => {
    loginAsGuest();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Login ke Sistem
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Laporan Keuangan Iuran Alumni
          </p>
        </div>

        <div className='flex justify-center'>
          {/* Login Form */}
          <div className={`${styles.form} card p-8`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Masukkan username"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Masukkan password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center space-x-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">atau</span>
                </div>
              </div>
            </div>

            {/* Guest Login */}
            <button
              type="button"
              onClick={handleGuestLogin}
              className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              disabled={isSubmitting}
            >
              Masuk sebagai guest
            </button>
          </div>

          {/* Demo Credentials */}
          {/* <div className="card p-4 bg-blue-50 border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Demo Credentials:
            </h3>
            <div className="text-xs text-blue-700 space-y-1">
              <div>
                <strong>Admin:</strong> username: admin, password: admin123
              </div>
              <div>
                <strong>Guest:</strong> klik "Masuk sebagai guest"
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
