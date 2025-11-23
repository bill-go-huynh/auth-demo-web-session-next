'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Card } from '@/components/ui';
import { env } from '@/lib/env';
import { ERRORS, MESSAGES } from '@/lib/constants';
import { isValidEmail, isValidPassword, sanitizeInput } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string; name?: string } = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !formData.name.trim()) {
      errors.name = 'Name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const sanitizedData = {
        email: sanitizeInput(formData.email),
        password: formData.password,
        name: isLogin ? '' : sanitizeInput(formData.name),
      };

      if (isLogin) {
        await login({ email: sanitizedData.email, password: sanitizedData.password });
      } else {
        await register({
          email: sanitizedData.email,
          password: sanitizedData.password,
          name: sanitizedData.name,
        });
      }
      router.push('/notes');
    } catch (err) {
      setError(err instanceof Error ? err.message : ERRORS.GENERIC);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = env.googleSessionUrl;
  };

  const handleInputChange = (field: 'email' | 'password' | 'name', value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Register'}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input
              label="Name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required={!isLogin}
              disabled={loading}
              error={formErrors.name}
            />
          )}

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            disabled={loading}
            error={formErrors.email}
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
            disabled={loading}
            minLength={6}
            error={formErrors.password}
          />

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? MESSAGES.LOADING : isLogin ? 'Login' : 'Register'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Login with Google
          </Button>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setFormErrors({});
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            disabled={loading}
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </Card>
    </div>
  );
}
