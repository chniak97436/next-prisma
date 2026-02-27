'use client';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import NavBar from './components/NavBar';
import Image from 'next/image';
import Link from 'next/link';


export default function Home() {
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState([])
  const [lastCommande, setLastCommande] = useState(null)
  const [commandeProducts, setCommandeProducts] = useState([])
  const [avisForm, setAvisForm] = useState({})
  const [avisSubmitting, setAvisSubmitting] = useState({})
  const [avisDone, setAvisDone] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem('token');
    let userId = null;
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Récupérer l'ID utilisateur du token
        userId = decoded.id || decoded.userId || decoded.sub;
        console.log('Token décodé:', decoded);
        
        setUser({
          id: userId,
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
        const dt = data.data.sort((a, b) => new Date(b.created_at) > new Date(a.created_at)). slice(0, 3);
        if (response.ok) {
          setProduct(dt);

        }
      } catch (error) {
        console.error('Error fetching last product:', error);
      }
    }
    lastProduct();

    // Fonction pour récupérer la dernière commande
    const lastCommandeUser = async (id) => {
      if (!id) {
        console.log('Pas d\'ID utilisateur, impossible de récupérer la commande');
        return;
      }
      
      try {
        // Utiliser le bon endpoint avec le paramètre userId en query string
        const response = await fetch(`/api/commande/?userId=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        
        console.log('Données commandes:', data);
        
        if (response.ok && data.data && data.data.length > 0) {
          // Prendre la première commande (car elles sont triées par date décroissante)
          console.log('Dernière commande trouvée:', data.data[0]);
          setLastCommande(data.data[0]);
        } else {
          console.log('Aucune commande trouvée pour cet utilisateur');
        }
      } catch (error) {
        console.error('Error fetching last commande:', error);
      }
    }
    
    // Appeler la fonction pour récupérer la commande avec l'ID utilisateur
    if (userId) {
      console.log('Appel lastCommandeUser avec userId:', userId);
      lastCommandeUser(userId);
    } else {
      console.log('Pas de userId trouvé');
    }

  }, []);

  // Récupérer les produits de la commande quand lastCommande est défini
  useEffect(() => {
    console.log('=== useEffect [lastCommande] déclenché ===');
    console.log('lastCommande:', lastCommande);
    
    const fetchCommandeProducts = async () => {
      if (!lastCommande?.id) {
        console.log('Pas de lastCommande.id, on ne fait rien');
        return;
      }
      
      console.log('Fetching produits pour commande:', lastCommande.id);
      
      try {
        const response = await fetch(`/api/commandeItems/?commandeId=${lastCommande.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log('Produits de la commande:', data);
        
        if (response.ok && data.data) {
          setCommandeProducts(data.data);
        }
      } catch (error) {
        console.error('Error fetching commande products:', error);
      }
    };

    fetchCommandeProducts();
  }, [lastCommande]);

  // Fonction pour soumettre un avis
  const submitAvis = async (productId) => {
    if (!user?.id) return;
    
    const form = avisForm[productId] || {};
    if (!form.note) {
      alert('Veuillez sélectionner une note');
      return;
    }

    setAvisSubmitting(prev => ({ ...prev, [productId]: true }));

    try {
      const response = await fetch('/api/avis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          productId: productId,
          note: form.note,
          comment: form.comment || ''
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Avis soumis avec succès !');
        // Mettre à jour l'état local pour indiquer que l'avis a été soumis
        setCommandeProducts(prev => 
          prev.map(item => 
            item.product_id === productId 
              ? { ...item, avisSoumis: true } 
              : item
          )
        );
      } else {
        alert('Erreur: ' + (data.message || 'Impossible de soumettre l\'avis'));
      }
    } catch (error) {
      console.error('Error submitting avis:', error);
      alert('Erreur lors de la soumission de l\'avis');
    } finally {
      setAvisSubmitting(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Gérer les changements dans le formulaire d'avis
  const handleAvisChange = (productId, field, value) => {
    setAvisForm(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [field]: value
      }
    }));
  };

  // Vérifier si un avis existe déjà pour un produit
  const checkExistingAvis = async (productId) => {
    if (!user?.id) return false;
    
    try {
      const response = await fetch(`/api/avis/?userId=${user.id}&productId=${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setAvisDone(true)
      return response.ok && data.data && data.data.length > 0;
    } catch (error) {
      console.error('Error checking existing avis:', error);
      return false;
    }
  };

  // Marquer les produits qui ont déjà un avis
  useEffect(() => {
    const checkAvisForProducts = async () => {
      if (!commandeProducts.length || !user?.id) return;
      
      const productsWithAvis = await Promise.all(
        commandeProducts.map(async (item) => {
          const hasAvis = await checkExistingAvis(item.product_id);
          return { ...item, avisSoumis: hasAvis };
        })
      );
      
      setCommandeProducts(productsWithAvis);
    };
    
    checkAvisForProducts();
  }, [commandeProducts.length, user?.id]);



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
       {/* Section de la dernière commande  */}
      <h1 className='text-2xl flex flex-row text-[#F5CC60] underline py-4 text-start px-4'>Votre derniere commande.</h1>
      <div className='w-full flex justify-center mx-auto  p-10 bg-[#F5CC60] '>
        
        {lastCommande ? (
          <div className='w-[80%] mt-4 px-2 mx-2 text-[#242124] text-start font-bold shadow-2xl bg-white p-4'>
            <h1 className='text-2xl'>Votre derniere commande :</h1>
            <p className='text-lg'><strong>Commande #{lastCommande.id}</strong></p>
            <p>Montant total: {lastCommande.total_amount} €</p>
            <p>Statut: {lastCommande.status}</p>
            <p>Adresse de livraison: {lastCommande.shipping_address || 'Non spécifiée'}</p>
            <p>Date: {new Date(lastCommande.created_at).toLocaleDateString('fr-FR')}</p>
            
           
       
            {/* Section produits de la commande avec formulaire d'avis */}
            {commandeProducts.length > 0 && (
              <div className='mt-6'>
                <h3 className='text-lg font-bold mb-4  pb-2'>Produits commandés - Donnez votre avis</h3>
                {commandeProducts.map((item) => (
                  <div key={item.id} className='border p-4 mb-4 rounded-lg bg-gray-50'>
                    <div className='flex items-center gap-4'>
                      {item.product?.image_url && (
                        <Image 
                        src={item.product.image_url} 
                        alt={item.product.name} 
                        width={60} 
                        height={60} 
                        className='object-contain'
                        />
                      )}
                      <div className='flex-1'>
                        <p className='font-bold'>{item.product?.name || 'Produit'}</p>
                        <p className='text-sm'>Quantité: {item.quantity}</p>
                        <p className='text-sm'>Prix: {item.unit_price} €</p>
                      </div>
                    </div>
                    
                    {/* Formulaire d'avis */}
                    {item.avisSoumis ? (
                      <div className='mt-3 p-2 bg-green-100 text-green-800 rounded'>
                        ✓ Avis déjà soumis pour ce produit
                      </div>
                    ) : (
                      <div className='mt-3 p-3 bg-gray-100 rounded'>
                        <p className='text-sm font-semibold mb-2'>Laisser un avis:</p>
                        <div className='flex gap-2 mb-2'>
                          {[1, 2, 3, 4, 5].map((note) => (
                            <button
                              key={note}
                              type='button'
                              onClick={() => handleAvisChange(item.product_id, 'note', note)}
                              className={`w-8 h-8 rounded-full font-bold ${
                                (avisForm[item.product_id]?.note || 0) >= note
                                  ? 'bg-[#F5CC60] text-[#242124]'
                                  : 'bg-gray-300 text-gray-600'
                              }`}
                            >
                              {note}
                            </button>
                          ))}
                        </div>
                        <textarea
                          placeholder='Commentaire (optionnel)'
                          value={avisForm[item.product_id]?.comment || ''}
                          onChange={(e) => handleAvisChange(item.product_id, 'comment', e.target.value)}
                          className='w-full p-2 border rounded text-sm mb-2 text-black'
                          rows={2}
                        />
                        <button
                          onClick={() => submitAvis(item.product_id)}
                          disabled={avisSubmitting[item.product_id] || !(avisForm[item.product_id]?.note)}
                          className='bg-[#242124] text-[#F5CC60] font-bold py-2 px-4 rounded-md hover:bg-[#242124]/80 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                          {avisSubmitting[item.product_id] ? 'Envoi...' : 'Soumettre l\'avis'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className='text-[#242124] font-bold'>Vous n'avez pas encore passé de commande.</p>
        )}
      </div>
    </main>
  );
}
