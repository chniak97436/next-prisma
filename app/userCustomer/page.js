"use client"
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import jwt from 'jsonwebtoken'
import { CircleUser,PencilLine } from 'lucide-react';
import Link from 'next/link';

export default function userCustomer() {
  //const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [objUser, setObjUser] = useState([]);
  const [disabled,setDisabled] = useState(true)
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {

    // LOG avec JWT decode
    const token = localStorage.getItem('token');
    let role = localStorage.getItem('role'),
      email = localStorage.getItem('email'),
      idUser = localStorage.getItem('id');

    if (token) {
      try {
        const decoded = jwt.decode(token);
        console.log('JWT payload:', decoded);
        role = decoded.role || role || 'unknown';
        email = decoded.email || email;
        idUser = decoded.id || decoded.userId || idUser;
      } catch (e) {
        console.error('JWT decode fail:', e);
      }

    }
    console.log('Vérif COMPLÈTE:', { token: !!token, role, email, idUser });
    setUser({
      email: email,
      role: role,
      idUser: idUser,
    });
    // ----------------FETCH STATS USER-----------------------
    console.log("----------------FETCH STATS USER-----------------------")


     const userFetchStats = async () => {
      //---------USER------------------
      const user = await fetch(`/api/users/${idUser}`)
      const dataUser = await user.json()
      setObjUser(dataUser.data)
      console.log("---------USER-------",objUser)

      // -------------------------------
      // --------AVIS-USER----------
      const avisUser = await fetch(`/api/avis/`,
        {
          where: {
            idUser
          }
        }
      )
      const dataAvis = await avisUser.json()
      if(dataAvis){
        return dataAvis
      }
      console.log("---------AVIS-USER-----",dataAvis)
    }
    
    userFetchStats()
  }, []);

  return (
   
      <form className="glass-strong w-[60%] mx-auto p-3 rounded-md shadow-md hover:shadow-3xl transition-all duration-500  text-white relative overflow-hidden">
        {/* Background shimmer */}
        <div className="absolute bg-gradient-to-r from-[#F5CC60]/20 via-transparent to-[#F5CC60]/20  pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-3">
          <div className="w-15 h-15 bg-white/20 glass rounded-md flex items-center justify-center ">
            <CircleUser className="w-10 h-10 text-[#F5CC60] drop-shadow-lg" />
          </div>
          
          <div className="">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#F5CC60] bg-clip-text text-transparent animate-slide-in-left">
              Profil Utilisateur
            </h2> 
          </div>
          
          <div className="w-full flex flex-row space-x-2 pt-4">
            <label htmlFor='email'
                   className="text-white/80 text-lg text-left"
                  >Email :  
            </label>
            <p className="text-white/80 text-lg text-left">
                {objUser?.email || 'Chargement...'}
            </p>
            <button 
              type="button"
              className='cursor-pointer'
              onClick={() => alert('Fonctionnalité à venir !')}
            ><PencilLine className="w-6 h-6 ml-3 "/></button>
            
            {/* <button 
              type="button"
              className="glass w-full py-3 px-6 rounded-2xl font-semibold text-white hover:bg-white/20 hover:text-[#F5CC60] transition-all duration-300 transform hover:scale-105 animate-glow"
              onClick={() => alert('Fonctionnalité à venir !')}
            >
              Modifier Profil
            </button> */}
           
          </div>
        </div>
      </form>
   
  )
}