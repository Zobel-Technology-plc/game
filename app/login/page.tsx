'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PhoneIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import PhoneInput from '../components/PhoneInput';

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (pass: string) => {
    if (pass.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate password
    if (!validatePassword(password)) {
      return;
    }

    setIsLoading(true);

    // Temporarily skip validation and just redirect
    try {
      localStorage.setItem('user', JSON.stringify({ 
        phone: phone || '+251912345678',
        isLoggedIn: true 
      }));
      router.push('/');
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    return phone.length >= 10 && password.length >= 6 && !passwordError;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 card p-6 md:p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">Welcome Back!</h2>
          <p className="mt-2 text-theme-secondary">Sign in to continue playing</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Phone Number
              </label>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                error={error && error.includes('phone') ? error : undefined}
              />
            </div>

            <div>
              <label className="text-sm text-theme-secondary block mb-2">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-secondary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className={`w-full bg-gray-100 dark:bg-white/5 rounded-lg p-3 pl-10 
                    text-gray-600 dark:text-gray-400
                    ${passwordError ? 'border-2 border-red-500' : ''}
                  `}
                  placeholder="••••••••"
                  required
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isFormValid()}
            className={`
              w-full py-3 rounded-lg font-bold transition-all duration-300
              bg-gradient-to-r from-primary to-orange-500
              ${(isLoading || !isFormValid()) 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105'}
            `}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center text-sm">
            <Link 
              href="/forgot-password"
              className="text-primary hover:text-orange-500 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="text-center text-sm text-theme-secondary">
            Don't have an account?{' '}
            <Link 
              href="/signup"
              className="text-primary hover:text-orange-500 transition-colors font-semibold"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 