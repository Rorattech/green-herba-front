"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import MainLayout from "@/src/layouts/MainLayout";
import { useAuth } from "@/src/contexts/AuthContext";
import { User, Package, FileText } from "lucide-react";
import { cn } from "@/src/utils/cn";

const nav = [
  { href: "/account/edit", label: "Editar conta", icon: User },
  { href: "/account/orders", label: "Meus pedidos", icon: Package },
  { href: "/account/prescriptions", label: "Prescrições médicas", icon: FileText },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user, router]);

  if (user === null) {
    return null;
  }

  return (
    <MainLayout>
      <section className="bg-white min-h-[calc(100vh-180px)] py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-0">
          <h1 className="text-h4 font-heading text-green-800 mb-6 md:mb-8">Minha conta</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <nav className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-6">
              <ul className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                {nav.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-2 text-body-m font-body py-2 px-3 rounded-full whitespace-nowrap transition-colors",
                        pathname === href || (href === "/account/edit" && pathname === "/account")
                          ? "bg-green-200 text-green-800 font-medium"
                          : "text-green-800 hover:bg-gray-100"
                      )}
                    >
                      <Icon size={18} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
