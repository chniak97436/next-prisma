'use client';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import NavBar from './components/NavBar';
import Image from 'next/image';
import Link from 'next/link';


export default function Home() {
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.name?.name || decoded.name || '',
          role: decoded.name?.role || decoded.role || '',
        });
      }
      catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    const lastProduct = async () => {
      try {
        const response = await fetch('/api/products/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        const dt = data.data.sort((a, b) => new Date(b.created_at) > new Date(a.created_at)).slice(0,3);
        if (response.ok) {
          setProduct(dt);

        }
      } catch (error) {
        console.error('Error fetching last product:', error);
      }
    }
    lastProduct();
  }, []);



  return (
    <main className="h-dvh w-dvw bg-[#242124] relative py-8  scale-0.1 text-[#F5CC60]">
      <NavBar user={{ name: user?.name, role: user?.role }} />

      <section className='min-w-full relative border-2 border-[#F5CC60]  text-[#F5CC60] mt-15 scale-0.3  shadow-lg  h-[70%]'>
        <Image src="/bg-page.png" alt="Hero Image" fill className="object-cover " />
      </section>
      <div className='w-full flex justify-center mx-auto  p-10 bg-gradient-to-r from-[#242124] via-[#F5CC60] to-[#242124]'>
        <div className='w-[80%] mt-10 mx-auto text-[#242124] text-center font-bold shadow-lg'>
          <h1 className='text-4xl py-2 px-4'>THE EVERYTHING EMPORIUM</h1>
          <p className='text-xl py-2'>Bienvenue to the everything emporium, là ou tous vos reves deviennent Réalitées!</p>
          
        </div>
      </div>
      <h1 className='text-2xl flex flex-row text-[#F5CC60] underline py-4 text-start px-4'>Nos dernières nouveautés...</h1>
      <div className='w-full flex justify-center mx-auto  p-10 bg-[#F5CC60] '>
        
        {product.map((prod) => (
          <div key={prod.id} className='w-[80%] mt-4 px-2 mx-2 text-[#F5CC60] text-start font-bold shadow-2xl bg-[#242124]'>
            <h1 className='text-center my-4 uppercase text-lg'>{prod.name}</h1>
            <Image src={prod.image_url} alt={prod.name} width={200} height={120} className='object-contain mb-8 mx-auto w-90 h-50' />
            <button className='mx-auto justify-center w-full'>
              <Link href={`/products/${prod.id}`} className='bg-[#F5CC60] text-[#242124] font-bold py-2 px-4 rounded-md hover:bg-[#F5CC60]/80 transition-colors duration-300 block mx-auto mb-4'>
                Voir le produit
              </Link>
            </button>
          </div>
        ))}
        </div>


    </main>
  );
}
