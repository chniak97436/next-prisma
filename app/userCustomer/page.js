"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken'
import { CircleUser, PencilLine, Send } from 'lucide-react';

export default function userCustomer({ params }) {
  const [user, setUser] = useState(null);
  const [objUser, setObjUser] = useState([]);
  const [promo, setPromo] = useState(null)
  const [promoLoading, setPromoLoading] = useState(true)
  const [editing, setEditing] = useState({
    username: false,
    first_name: false,
    last_name: false,
    email: false,
    adresse: false,
    phone: false
  })

  // états inputs 
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    adresse: '',
    phone: ''
  });

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({...prev, [fieldName]: value}));
  };
  const router = useRouter();

  // Fonction update un champ
  const updateField = async (fieldName, fieldValue) => {
    try {
      const token = localStorage.getItem('token');
      let idUser = localStorage.getItem('id');
      
      if (token) {
        const decoded = jwt.decode(token);
        idUser = decoded.id || decoded.userId || idUser;
      }
      
      if (!idUser) {
        console.error('ID utilisateur non trouvé');
        return;
      }

      const res = await fetch(`/api/users/${idUser}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ [fieldName]: fieldValue })
      });

      if (res.ok) {
        setEditing(prev => ({...prev, [fieldName]: false}));
        // Refresh objUser
        const userRes = await fetch(`/api/users/${idUser}`);
        const data = await userRes.json();
        setObjUser(data.data);
      } else {
        console.error('Erreur API:', await res.text());
      }
    } catch (error) {
      console.error('Erreur update:', error);
    }
  };

  useEffect(() => {
    const unwrapParams = async () => {
      await params; 
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    let role = localStorage.getItem('role'),
      emailLs = localStorage.getItem('email'),
      idUser = localStorage.getItem('id');

    if (token) {
      try {
        const decoded = jwt.decode(token);
        console.log('JWT payload:', decoded);
        role = decoded.role || role || 'unknown';
        emailLs = decoded.email || emailLs;
        idUser = decoded.id || decoded.userId || idUser;
      } catch (e) {
        console.error('JWT decode fail:', e);
      }
    }
  console.log('Vérif COMPLÈTE:', { token: !!token, role, email: emailLs, idUser });
  const userEmail = emailLs; // Garder email pour promo
  setFormData(prev => ({...prev, email: userEmail}));
    setUser({
      email: emailLs,
      role: role,
      idUser: idUser,
    });
    console.log("----------------FETCH STATS USER-----------------------")

    const userFetchStats = async () => {
      const user = await fetch(`/api/users/${idUser}`)
      const dataUser = await user.json()
      setObjUser(dataUser.data)
      
      // init les inputs avec les valeurs utilisateur
      if (dataUser.data) {
        setFormData({
          username: dataUser.data.username || "",
          first_name: dataUser.data.first_name || "",
          last_name: dataUser.data.last_name || "",
          email: dataUser.data.email || "",
          adresse: dataUser.data.adresse || "",
          phone: dataUser.data.phone || ""
        });
      }
      
      console.log("---------USER-------", dataUser.data)

      const avisUser = await fetch(`/api/avis?userId=${idUser}`)
      const dataAvis = await avisUser.json()
      console.log("---------AVIS-USER-----", dataAvis)
    }
    userFetchStats()
  }, []);

  useEffect(() => {
    const loadPromo = async () => {
      setPromoLoading(true);
      try {
        console.log("LOAD PROMO SIMPLE email:", formData.email);
        const res = await fetch(`/api/newsletter/promo/${formData.email}`);
        const data = await res.json();
        console.log("PROMO INDEP DATA:", data);
        setPromo(data);
      } catch (e) {
        console.error("Promo error:", e);
        setPromo({ valide: false, message: 'Error' });
      } finally {
        setPromoLoading(false);
      }
    };
    if (formData.email) loadPromo();
  }, [formData.email]);

  return (
    <form className="glass-strong w-[55%] mx-auto p-3 rounded-md shadow-md hover:shadow-3xl transition-all duration-500  text-white relative overflow-hidden">
      <div className="absolute bg-gradient-to-r from-[#F5CC60]/20 via-transparent to-[#F5CC60]/20  pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
        <div className="w-15 h-15 bg-white/20 glass rounded-md flex items-center justify-center ">
          <CircleUser className="w-10 h-10 text-[#F5CC60] drop-shadow-lg" />
        </div>

        <div className="">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#F5CC60] bg-clip-text text-transparent animate-slide-in-left">
            Mon Compte 
          </h2>
        </div>
        {/* ----------------------------------username------------------------------ */}
        <div className="w-full flex flex-row space-x-1 pt-4">
          {!editing.username ? (
            <div className="w-full flex flex-row space-x-1 pt-4 transition-all duration-300 opacity-100 scale-100">
              <label htmlFor='username' className="text-white/80 text-lg text-left">Username :</label>
              <p className="text-white/80 text-lg text-left">
                {objUser?.username || 'A renseigner...'}
              </p>
              <button type="button" className='cursor-pointer flex ml-3' onClick={() => setEditing(prev => ({...prev, username: true}))}>
                <PencilLine className="w-6 h-6 ml-3 rounded-md mr-1 p-1" />
                <span>Modifier</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-row space-x-1 pt-4 transition-all duration-300 opacity-100 scale-100">
              <input type="text" name="username" className='rounded-md w-[35%] outline-none underline' value={formData.username} onChange={(e) => handleInputChange('username', e.target.value)} placeholder='username' />
              <button type="button" className='cursor-pointer flex ml-3' onClick={() => updateField('username', formData.username)}>
                <Send className="w-6 h-6 mx-3 rounded-md bg-[#F5CC60] text-green-500 p-1" />
                <span>Envoyer</span>
              </button>
            </div>
          )}
        </div>

        {/* ----------------------------------First_name------------------------------ */}
        <div className="w-full flex flex-row space-x-1 pt-4">
          {!editing.first_name ? (
            <div className="w-full flex flex-row space-x-1 pt-4 transition-all duration-300 opacity-100 scale-100">
              <label htmlFor='nom' className="text-white/80 text-lg text-left">Nom :</label>
              <p className="text-white/80 text-lg text-left">
                {objUser?.first_name || 'A renseigner...'}
              </p>
              <button type="button" className='cursor-pointer flex ml-3' onClick={() => setEditing(prev => ({...prev, first_name: true}))}>
                <PencilLine className="w-6 h-6 ml-3 rounded-md mr-1 p-1" />
                <span>Modifier</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-row space-x-1 pt-4 transition-all duration-300 opacity-100 scale-100">
              <input type="text" name="first_name" className='rounded-md w-[35%] outline-none underline' value={formData.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} placeholder='Nom' />
              <button type="button" className='cursor-pointer flex ml-3' onClick={() => updateField('first_name', formData.first_name)}>
                <Send className="w-6 h-6 mx-3 rounded-md bg-[#F5CC60] text-green-500 p-1" />
                <span>Envoyer</span>
              </button>
            </div>
          )}
        </div>

        {/* ----------------------------------last_name------------------------------- */}
        
        <div className="w-full flex flex-row space-x-1 pt-4">
          {!editing.last_name ? (
            <div className="w-full flex flex-row space-x-1 pt-4 transition-all duration-300 opacity-100 scale-100">
              <label htmlFor='last_name' className="text-white/80 text-lg text-left">Prénom :</label>
              <p className="text-white/80 text-lg text-left">
                {objUser?.last_name || 'A renseigner...'}
              </p>
              <button type="button" className='cursor-pointer flex ml-3' onClick={() => setEditing(prev => ({...prev, last_name: true}))}>
                <PencilLine className="w-6 h-6 ml-3 rounded-md mr-1 p-1" />
                <span>Modifier</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-row space-x-1 pt-4 transition-all duration-300 opacity-100 scale-100">
              <input type="text" name="last_name" className='rounded-md w-[35%] outline-none underline' value={formData.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} placeholder='Prénom' />
              <button type="button" className='cursor-pointer flex ml-3' onClick={() => updateField('last_name', formData.last_name)}>
                <Send className="w-6 h-6 mx-3 rounded-md bg-[#F5CC60] text-green-500 p-1" />
                <span>Envoyer</span>
              </button>
            </div>
          )}
        </div>

        {/* EMAIL */}
        <div className="w-full flex flex-row space-x-1 pt-4">
          {!editing.email ? (
            <div className="w-full flex flex-row space-x-1 pt-4 transition-all duration-300 opacity-100 scale-100">
              <label htmlFor='email' className="text-white/80 text-lg text-left">Email :</label>
              <p className="text-white/80 text-lg text-left">
                {objUser?.email || 'Chargement...'}
              </p>
              <button type="button" className='cursor-pointer flex ml-3' onClick={() => setEditing(prev => ({...prev, email: true}))}>
                <PencilLine className="w-6 h-6 ml-3 rounded-md mr-1 p-1" />
                <span>Modifier</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-row space-x-1 pt-4 transition-all duration-300 opacity-100 scale-100">
              <input type="email" name="email" className='rounded-md w-[35%] outline-none underline' value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder='exemple@exemple.ex' />
              <button type="button" className='cursor-pointer flex ml-3' onClick={() => updateField('email', formData.email)}>
                <Send className="w-6 h-6 mx-3 rounded-md bg-[#F5CC60] text-green-500 p-1" />
                <span>Envoyer</span>
              </button>
            </div>
          )}
        </div>

        {/* ADRESSE */}
        <div className="w-full flex flex-row space-x-1 pt-4">
          {!editing.adresse ? (
            <div className="w-full flex flex-row space-x-1 pt-4 transition-all duration-300 opacity-100 scale-100">
              <label htmlFor='adresse' className="text-white/80 text-lg text-left">Adresse :</label>
              <p className="text-white/80 text-lg text-left">
                {objUser?.adresse || 'A renseigner...'}
              </p>
              <button type="button" className='cursor-pointer flex ml-3' onClick={() => setEditing(prev => ({...prev, adresse: true}))}>
                <PencilLine className="w-6 h-6 ml-3 rounded-md mr-1 p-1" />
                <span>Modifier</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-row space-x-1 pt-4 transition-all duration-300 opacity-100 scale-100">
              <input type="text" name="adresse" className='rounded-md w-[35%] outline-none underline' value={formData.adresse} onChange={(e) => handleInputChange('adresse', e.target.value)} placeholder='(n°,rue,ville,Code-Postal)' />
              <button type="button" className='cursor-pointer flex ml-3' onClick={() => updateField('adresse', formData.adresse)}>
                <Send className="w-6 h-6 mx-3 rounded-md bg-[#F5CC60] text-green-500 p-1" />
                <span>Envoyer</span>
              </button>
            </div>
          )}
        </div>

        {/* PHONE */}
        <div className="w-full flex flex-row space-x-1 pt-4">
          {!editing.phone ? (
            <div className="w-full flex flex-row space-x-1 pt-4 transition-all duration-300 opacity-100 scale-100">
              <label htmlFor='phone' className="text-white/80 text-lg text-left">Téléphone :</label>
              <p className="text-white/80 text-lg text-left">
                {objUser?.phone || 'A renseigner...'}
              </p>
              <button type="button" className='cursor-pointer flex ml-3' onClick={() => setEditing(prev => ({...prev, phone: true}))}>
                <PencilLine className="w-6 h-6 ml-3 rounded-md mr-1 p-1" />
                <span>Modifier</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-row space-x-1 pt-4 transition-all duration-300 opacity-100 scale-100">
              <input type="text" name="phone" className='rounded-md w-[35%] outline-none underline' value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder='(06-07 max=8)' />
              <button type="button" className='cursor-pointer flex ml-3' onClick={() => updateField('phone', formData.phone)}>
                <Send className="w-6 h-6 mx-3 rounded-md bg-[#F5CC60] text-green-500 p-1" />
                <span>Envoyer</span>
              </button>
            </div>
          )}
        </div>

        {/* PROMO-CODE */}
        <div className="w-full flex flex-row space-x-1 pt-4">
          <div className="w-full flex flex-row space-x-1 pt-4 transition-all duration-300">
            <label htmlFor='promo' className="text-white/80 text-lg text-left">Code promo :</label>
            <p className="text-white/80 text-lg text-left">
              {promoLoading ? 'Chargement...' : promo?.used
                ? `Code déjà utilisé le ${new Date(promo.promoCodeUsedAt).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                : promo?.valide
                  ? `${promo.promoCode} (disponible)`
                  : promo?.message || "Pas encore de code ou abonnement."
              }
            </p>
          </div>
        </div>
      </div>     
    </form>
  )
}

