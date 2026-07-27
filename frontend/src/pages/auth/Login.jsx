import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FormField from '../../components/ui/FormField';
import { useAuth } from '../../context/AuthContext';
import getErrorMessage from '../../utils/getErrorMessage';

const schema = yup.object({
  email: yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit(values) {
    setSubmitError('');
    try {
      await login(values);
      toast.success('Welcome back!');
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      setSubmitError(getErrorMessage(err, 'Incorrect email or password'));
    }
  }

  return (
    <AuthLayout
      heading="Welcome back to the Clay Cart."
      subtext="Continue your journey with pieces that carry the soul of the maker and the warmth of the earth."
    >
      <h1 className="text-3xl font-bold text-ink-900">Sign In</h1>
      <p className="mt-2 text-ink-600">Access your curated collection and history.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        {submitError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</p>}

        <FormField label="Email Address" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" placeholder="name@example.com" {...register('email')} />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          action={
            <Link to="/forgot-password" className="text-sm font-medium text-clay-600 hover:underline">
              Forgot Password?
            </Link>
          }
        >
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="pr-12"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </FormField>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login →'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-600">
        New to ClayCart?{' '}
        <Link to="/register" className="font-semibold text-clay-600 hover:underline">
          Create Account
        </Link>
      </p>
    </AuthLayout>
  );
}
