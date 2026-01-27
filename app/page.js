'use client';
import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import NavBar from './components/NavBar';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [rippleEffect, setRippleEffect] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt.decode(token);
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

  const handleCTAClick = () => {
    setRippleEffect(true);
    setTimeout(() => setRippleEffect(false), 600);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <NavBar user={{name: user?.name, role: user?.role}} />
      <motion.div
        className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden"
        style={{ y }}
      >
        {/* Animated background elements with Framer Motion */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-10 rounded-full"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-48 h-48 bg-yellow-300 opacity-20 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-32 h-32 bg-pink-300 opacity-15"
            animate={{
              borderRadius: ["50%", "25% 75% 50% 50%", "75% 25% 50% 50%", "50%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-blue-300 opacity-10"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        {/* Parallax effect container */}
        <motion.div
          className="parallax relative z-10 w-full max-w-6xl mx-auto mt-[5%]"
          variants={containerVariants}
        >
          <motion.div
            className="text-center"
            variants={itemVariants}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-extrabold text-white mb-6"
              style={{textShadow: '0 0 30px rgba(255,255,255,0.5)'}}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                damping: 10,
                stiffness: 100,
                delay: 0.5
              }}
              whileHover={{ scale: 1.05 }}
            >
              MonApp
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-white mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Découvrez une expérience utilisateur exceptionnelle
            </motion.p>
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12"
            variants={containerVariants}
          >
            <AnimatePresence>
              {user ? (
                <motion.div
                  className="glass-strong rounded-3xl p-8 md:p-12 text-center max-w-lg"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-3xl">👋</span>
                  </motion.div>
                  <motion.h2
                    className="text-3xl font-bold text-white mb-4"
                    variants={itemVariants}
                  >
                    Bienvenue, {user?.name}!
                  </motion.h2>
                  <motion.p
                    className="text-lg text-gray-200 mb-4"
                    variants={itemVariants}
                  >
                    Rôle : <span className="font-semibold text-yellow-300">{user?.role}</span>
                  </motion.p>
                  <motion.p
                    className="text-gray-300 mb-6"
                    variants={itemVariants}
                  >
                    Vous êtes maintenant connecté à votre compte.
                  </motion.p>
                  {user.role === 'admin' && (
                    <motion.div variants={itemVariants}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href="/admin"
                          onClick={handleCTAClick}
                          className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-glow relative overflow-hidden"
                        >
                          <AnimatePresence>
                            {rippleEffect && (
                              <motion.span
                                className="absolute inset-0 bg-white opacity-30 rounded-full"
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 4, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                              />
                            )}
                          </AnimatePresence>
                          Accéder au tableau de bord admin
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  className="glass-strong rounded-3xl p-8 md:p-12 text-center max-w-lg"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="text-3xl">🚀</span>
                  </motion.div>
                  <motion.h2
                    className="text-3xl font-bold text-white mb-4"
                    variants={itemVariants}
                  >
                    Bienvenue sur MonApp!
                  </motion.h2>
                  <motion.p
                    className="text-lg text-gray-200 mb-6"
                    variants={itemVariants}
                  >
                    Connectez-vous pour accéder à votre compte et découvrir toutes les fonctionnalités.
                  </motion.p>
                  <motion.div
                    className="space-y-4"
                    variants={itemVariants}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/login"
                        onClick={handleCTAClick}
                        className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-glow relative overflow-hidden mr-4"
                      >
                        <AnimatePresence>
                          {rippleEffect && (
                            <motion.span
                              className="absolute inset-0 bg-white opacity-30 rounded-full"
                              initial={{ scale: 0, opacity: 1 }}
                              animate={{ scale: 4, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.6 }}
                            />
                          )}
                        </AnimatePresence>
                        Se connecter
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href="/register"
                        className="inline-block text-white hover:text-yellow-300 transition-all duration-300 transform hover:scale-105 underline"
                      >
                        S'inscrire
                      </Link>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feature showcase */}
            <motion.div
              className="glass rounded-2xl p-6 md:p-8 max-w-md"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.h3
                className="text-2xl font-bold text-white mb-4"
                variants={itemVariants}
              >
                Fonctionnalités Clés
              </motion.h3>
              <motion.ul
                className="text-gray-200 space-y-2"
                variants={containerVariants}
              >
                {[
                  "Authentification sécurisée",
                  "Interface admin complète",
                  "Design moderne et responsive",
                  "Animations fluides"
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center"
                    variants={itemVariants}
                    whileHover={{ x: 10 }}
                  >
                    <motion.span
                      className="text-green-400 mr-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 1 }}
                    >
                      ✓
                    </motion.span>
                    {feature}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
