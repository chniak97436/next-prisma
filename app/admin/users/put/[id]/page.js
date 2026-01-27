"use client"
import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import bcryptjs from 'bcryptjs';
export default function putUserId({ params }) {
  const { id } = use(params);
  const userId = parseInt(id, 10);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [password_hash, setPassword_hash] = useState('');
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const router = useRouter();

  useEffect(() => {
    console.log('useEffect triggered for userId:', userId);
    const user = async () => {
      setLoading(true);
      try {
        console.log('Fetching user data for ID:', userId);
        const res = await fetch(`/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Fetch response status:', res.status);
        if (res.ok) {
          const data = await res.json();
          console.log('Fetched data:', data);
          setPassword_hash(bcryptjs.hashSync(data.data.password_hash, 12)); // Set a default hashed password
          setUsername(data.data.username );
          setEmail(data.data.email);
          setRole(data.data.role === 'admin' || data.data.role === 'visiteur' ? data.data.role : 'admin');
          setFirst_name(data.data.first_name || '');
          setLast_name(data.data.last_name || '');
          setAddress(data.data.address || '');
          setPhone(data.data.phone || '');
        } else {
          console.error("Erreur lors de la récupération de l'utilisateur:", res.statusText);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
      } finally {
        setLoading(false);
      }
    };
    user();
  }, [userId]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">Chargement...</div>;
  }
  const putUsers = async (e) => {
    e.preventDefault();
    console.log('Form submitted for userId:', userId);
    console.log('Form data:', { username, email, role, first_name, last_name, address, phone });
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          role,
          first_name,
          last_name,
          address,
          phone
        }),
      });
      console.log('PUT response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('PUT success data:', data);
        alert("Utilisateur modifié avec succès.");
        router.push('/admin/users');
      } else {
        const data = await response.json();
        console.error("Erreur lors de la modification de l'utilisateur:", data.message || response.statusText);
      }
    } catch (error) {
      console.error('Error updating users:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Modifier l'Utilisateur</h1>
        <form className="p-6 border rounded-lg shadow-lg bg-white" onSubmit={putUsers}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Rôle</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Prénom</label>
            <input
              type="text"
              value={first_name}
              onChange={(e) => setFirst_name(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nom de famille</label>
            <input
              type="text"
              value={last_name}
              onChange={(e) => setLast_name(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Adresse</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Téléphone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
}