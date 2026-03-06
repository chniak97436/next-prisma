'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthForm from '../components/auth/AuthForm';
import Input from '../components/auth/Input';
import Button from '../components/auth/Button';
import Link from 'next/link';
import GoogleSignInButton from '../components/GoogleSignInButton';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Gestion des messages de vérification email
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setSuccessMessage("Email vérifié ! Vous pouvez maintenant vous connecter.");
    }
  }, [searchParams]);

  // Gestion des erreurs Google dans l'URL
  useEffect(() => {
    const googleError = searchParams.get('error');
    if (googleError) {
      const errorMessages = {
        'google_no_code': 'Erreur de connexion avec Google',
        'google_auth_failed': 'L\'authentification Google a échoué',
        'google_user_not_found': 'Aucun compte associé à cet email Google',
        'google_email_not_verified': 'Votre email Google n\'est pas vérifié',
      };
      setError(errorMessages[googleError] || 'Erreur lors de la connexion Google');
    }
  }, [searchParams]);

  // Redirection après connexion réussie
  useEffect(() => {
    if (isLoggedIn) {
      setSuccessMessage("Connexion réussie !");
      setTimeout(() => {
        if (role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/'); // rediriger vers la page d'accueil
        }
      }, 2000);
    }
  }, [isLoggedIn, router, role]);

  // Soumission du formulaire traditionnel
  const formSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const res = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        setRole(res.role);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setError(res.message || 'Échec de la connexion. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  }

  // Gestion de la connexion Google
  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    setError('');
    // Redirection vers l'endpoint Google
    window.location.href = '/api/auth/google';
  };

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
      
      <span className='text-gray-500 text-sm mt-3'>
        8 caractères minimum
      </span>
      <br />
      <span className='text-gray-500 text-sm mt-6 font-black'>
        Au moins une majuscule, une minuscule, un chiffre et un caractère spécial
      </span>
      <br />
      <Button>
        Se connecter
      </Button>
      
      <Link 
        href="/forgot-password" 
        className="text-sm font-bold text-blue-600 hover:underline block text-center mt-4"
      >
        Mot de passe oublié ?
      </Link>

      {/* Séparateur "Ou" */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Ou</span>
        </div>
      </div>

      {/* Bouton Google avec état de chargement */}
      <div className="mt-4 hover:scale-105 transition-transform duration-300">
        <GoogleSignInButton 
          onClick={handleGoogleSignIn}
          isLoading={googleLoading}
          text={googleLoading ? "Connexion en cours..." : "Se connecter avec Google"}
        />
      </div>

      {/* Lien d'inscription */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Pas encore de compte ?{' '}
        <Link href="/register" className="font-bold text-blue-600 hover:underline">
          S'inscrire
        </Link>
      </p>
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