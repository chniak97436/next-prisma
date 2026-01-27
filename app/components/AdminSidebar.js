'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  Tag,
  Plus,
  Settings
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Catégories',
    href: '/admin/categories',
    icon: Tag,
    subItems: [
      { title: 'Voir toutes', href: '/admin/categories' },
      { title: 'Créer', href: '/admin/categories/create' },
    ],
  },
  {
    title: 'Produits',
    href: '/admin/products',
    icon: Package,
    subItems: [
      { title: 'Voir tous', href: '/admin/products' },
      { title: 'Créer', href: '/admin/products/create' },
    ],
  },
  {
    title: 'Utilisateurs',
    href: '/admin/users',
    icon: Users,
    subItems: [
      { title: 'Voir tous', href: '/admin/users' },
      { title: 'Créer', href: '/admin/users/create' },
    ],
  },
  {
    title: 'Commandes',
    href: '/admin/commandes',
    icon: ShoppingCart,
  },
  {
    title: 'Paiements',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    title: 'Avis',
    href: '/admin/avis',
    icon: MessageSquare,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white shadow-lg border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname === sub.href));

            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.title}
                </Link>
                {item.subItems && isActive && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`block px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                          pathname === subItem.href
                            ? 'bg-blue-100 text-blue-800'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
