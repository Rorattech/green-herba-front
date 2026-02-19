"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";

export default function AccountPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/account/edit");
  }, [user, router]);

  return null;
}
