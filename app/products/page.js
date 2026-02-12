"use client"
import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './../components/CartContext';

export default function products() {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [user, setUser] = useState(null);
    const { addToCart } = useCart();
    const [categoryName, setCategoryName] = useState(["All"]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    //------------userName & userRole---------------
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
    }, []);
    //fetch produits-----------------
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setAllProducts(data.data);
                setFilteredProducts(data.data);
                console.log("data : ", data.data)
            }
            catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);
    // Filtre des catégories -------------------
    // Ce useEffect se déclenche quand la liste des produits change
    useEffect(() => {
        // Vérifier si les produits sont chargés (pas vide)
        if (allProducts.length > 0) {
            // Créer un ensemble (Set) pour éviter les doublons des noms de catégories
            const uniqueCategories = new Set();

            // Parcourir chaque produit
            allProducts.forEach((prod) => {
                // Vérifier si le produit a une catégorie et un nom
                if (prod.category && prod.category.name) {
                    // Ajouter le nom de la catégorie à l'ensemble (pas de doublons)
                    uniqueCategories.add(prod.category.name);
                }
            });

            // Convertir l'ensemble en tableau et mettre à jour l'état
            setCategoryName(["All", ...Array.from(uniqueCategories)]);

            // Afficher dans la console pour déboguer
            console.log("Catégories uniques :", Array.from(uniqueCategories));
        }
    }, [allProducts]); // Dépendance sur 'allProducts' pour se relancer quand les produits changent

    // Filtrage des produits basé sur la catégorie sélectionnée
    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredProducts(allProducts);
        } else {
            setFilteredProducts(allProducts.filter((prod) => prod.category.name === selectedCategory));
        }
    }, [selectedCategory, allProducts]);

    //ADDTOCART---------------
    const handleAddToCart = (item) => {
        if (!item) return;
        // On crée un objet propre avec TOUTES les infos
        const itemToAdd = {
            id: item.id,
            name: item.name,
            price: parseFloat(item.price), // On s'assure que c'est un nombre
            image_url: item.image_url,
        };
        console.log("J'envoie ceci au CartContext :", itemToAdd);
        addToCart(itemToAdd);   
    };
    // ----------filter----------------
    const handleFilter = (cat) => {
        setSelectedCategory(cat);
        console.log("Filtering by category:", cat);
    };
    return (
        <main className="h-dvh  min-w-full bg-[#292322] py-8 px-4">
            <NavBar user={{ name: user?.name, role: user?.role }} />
            <div className="max-w-7xl mt-20 mx-auto">
                <h1 className="text-3xl font-bold text-center text-[#F5CC60] mb-8">Tous nos produits</h1>
                <div className="flex flex-wrap justify-center  mb-8">
                    {categoryName.map((cat, index) => (
                        <button key={ index}
                            onClick={() => handleFilter(cat)}
                            className="bg-[#242124] hover:bg-[#36454F] border border-[#EFECE6]  font-medium py-2 px-4 mb-10 text-[#F5CC60] transition-colors duration-200">
                            {cat === "All" ? "Tous" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
                    {filteredProducts.map((prod) => (
                        <div key={prod.id} className="bg-[#F5CC60] rounded-t-xl shadow-sm hover:shadow-lg transition-shadow duration-300  border border-[#F5CC60] hover:border-gray-300 h-auto mb-10 flex flex-col">
                            <div className="rounded-t-xl h-48 flex items-center justify-center">
                                {/* <h1>{prod.category.name}</h1> */}
                                <Image src={prod.image_url} alt={prod.name} width={400} height={192} className="max-w-full rounded-t-xl max-h-full object-contain bg-[#F5CC60]" />
                            </div>
                            <div className="p-6 grid grid-rows-[auto_1fr_auto_auto] gap-4 h-full">
                                <h2 className="text-xl font-semibold text[#242124]overflow-hidden">{prod.name}</h2>
                                <p className="text-gray-600 text-sm overflow-hidden">{prod.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-[#242124]">{prod.price} €</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleAddToCart(prod)} className="flex-1 bg-[#242124] hover:bg-[#3e3e3e] text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center whitespace-nowrap">
                                        <svg className="w-5 h-5 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3" />
                                        </svg>
                                        Ajouter au panier
                                    </button>
                                    <Link href={`/products/${prod.id}`} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                                        Détails
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
