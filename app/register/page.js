'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../components/auth/AuthForm';
import Input from '../components/auth/Input';
import Button from '../components/auth/Button';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccessMessage(data.message);
      // rediriger après un court délai
      setTimeout(() => router.push('/login'), 15000);
    } else {
      setError(data.error || 'Une erreur est survenue.');
    }
  };

  return (
    <AuthForm
      title="Créer un compte"
      onSubmit={handleSubmit}
      errorMessage={error}
      successMessage={successMessage}
    >
        {!successMessage && (
            <>
                <Input
                    label="Nom d'utilisateur"
                    type="text"
                    id="username"
                    name="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
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
                <span className='text-gray-500 text-sm mt-3'>8 caractères minimum</span><br/>
                <span className='text-gray-500 text-sm mt-6'>Au moins une majuscule, une minuscule, un chiffre et un caractère spécial</span>
                <Button>
                    S'inscrire
                </Button>
            </>
        )}
    </AuthForm>
  );
}
