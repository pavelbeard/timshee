/**
 * Login page
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm, RegisterForm } from '../../../components';

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);
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
        {showRegister ? (
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onLoginClick={() => setShowRegister(false)}
          />
        ) : (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onRegisterClick={() => setShowRegister(true)}
          />
        )}
      </div>
    </div>
  );
}
