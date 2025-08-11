/**
 * Register page
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm, RegisterForm } from '../../../components';

export default function RegisterPage() {
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/');
  };

  const handleRegisterSuccess = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {showLogin ? (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onRegisterClick={() => setShowLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onLoginClick={() => setShowLogin(true)}
          />
        )}
      </div>
    </div>
  );
}
