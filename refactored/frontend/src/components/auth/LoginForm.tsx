/**
 * Login form component with validation
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card, CardContent } from '../ui';
import { useLogin } from '../../shared/hooks';

const loginSchema = z.object({
  username: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onRegisterClick,
}) => {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation
      console.error('Login failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
          <p className="text-gray-600 mt-2">Welcome back to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Username or Email"
            type="text"
            placeholder="Enter your username or email"
            error={errors.username?.message}
            fullWidth
            {...register('username')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            fullWidth
            {...register('password')}
          />

          {loginMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                {loginMutation.error instanceof Error
                  ? loginMutation.error.message
                  : 'Login failed. Please try again.'}
              </p>
            </div>
          )}

          <Button
            type="submit"
            loading={loginMutation.isPending}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={onRegisterClick}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Create one here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
