'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    UserPen,
    Briefcase,
    Code,
    BadgeEuro,
    MessageSquareShare,
} from "lucide-react"

const userItems = [
  {
    title: 'Mon Compte',
    href: '/userCustomer',
    icon: UserPen,
  },
  {
    title: 'Mes commandes',
    href: '/userCustomer/commandes',
    icon: Briefcase,
  },
  {
    title: 'Mes avis',
    href: '/userCustomer/avis',
    icon: MessageSquareShare,
  }
]
export default function UserSideBar() {
    const pathname = usePathname();

    return (
        <div className="fixed left-0 top-20 h-full w-64 bg-[#292322] shadow-lg border-r border-[#F5CC60]/20 overflow-y-auto">
            <div className="p-4">
                <nav className="space-y-2">
                    {userItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href

                        return (
                            <div key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                            ? 'bg-[#F5CC60]/20 text-[#F5CC60] border-r-2 border-[#F5CC60]'
                                            : 'text-[#F5CC60]/70 hover:bg-[#F5CC60]/10 hover:text-[#F5CC60]'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {item.title}
                                </Link>
                                
                            </div>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
