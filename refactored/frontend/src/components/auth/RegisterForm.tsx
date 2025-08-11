/**
 * Registration form component with validation
 */

'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card, CardContent } from '../ui';
import { useRegister } from '../../shared/hooks';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string().min(1, 'Please confirm your password'),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ["password_confirm"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onLoginClick,
}) => {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation
      console.error('Registration failed:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join us and start shopping</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              error={errors.first_name?.message}
              {...register('first_name')}
            />

            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.last_name?.message}
              {...register('last_name')}
            />
          </div>

          <Input
            label="Username"
            placeholder="Enter your username"
            error={errors.username?.message}
            fullWidth
            {...register('username')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            fullWidth
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            fullWidth
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            error={errors.password_confirm?.message}
            fullWidth
            {...register('password_confirm')}
          />

          {registerMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                {registerMutation.error instanceof Error
                  ? registerMutation.error.message
                  : 'Registration failed. Please try again.'}
              </p>
            </div>
          )}

          <Button
            type="submit"
            loading={registerMutation.isPending}
            className="w-full"
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
