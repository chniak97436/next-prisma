'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthForm from '../components/auth/AuthForm';
import Input from '../components/auth/Input';
import Button from '../components/auth/Button';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccessMessage("Email vérifié ! Vous pouvez maintenant vous connecter.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (isLoggedIn) {
      setSuccessMessage("Connexion réussie !");

      setTimeout(() => {
        if (role === 'admin' ) {
          router.push('/admin');
        } else {
          router.push('/'); // rediriger vers le tableau de bord après la connexion
        }
      }, 2000);
    }
  }, [isLoggedIn, router, role]);

  const formSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const data = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const res = await data.json();
    if (res.ok) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.role);
      setRole(res.role);
      setIsLoggedIn(true);
    }else {
      setIsLoggedIn(false);
      setError(res.message || 'Échec de la connexion. Veuillez réessayer.');
    }
  }

  return (
    <AuthForm
        title="Se connecter"
        onSubmit={formSubmit}
        errorMessage={error}
        successMessage={successMessage}
    >
        <Input
            label="Adresse e-mail"
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <Input
            label="Mot de passe"
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <span className='text-gray-500 text-sm mt-3'>8 caractères minimum</span><br />
        <span className='text-gray-500 text-sm mt-6'>Au moins une majuscule, une minuscule, un chiffre et un caractère spécial</span>
        <Button>
            Se connecter
        </Button>
    </AuthForm>
  );
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}
