"use client";

import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/src/layouts/MainLayout";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <MainLayout>
      <section className="bg-white min-h-[calc(100vh-180px)] flex flex-col md:flex-row">

        <div className="relative w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1532765488483-62ff440ee4fd?q=90&w=1920"
            alt="Green Herba Pharma Life"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-white font-heading text-h3 md:text-h2 lg:text-h1 whitespace-nowrap opacity-90">
              Green Herba Pharma &nbsp; Green Herba Pharma &nbsp; Green Herba Pharma
            </h2>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
          <div className="w-full max-w-[440px] space-y-8">
            <div className="space-y-2">
              <h1 className="text-h2 font-heading text-green-800">Reset password</h1>
              <p className="text-body-m text-green-800/70">
                Enter a new password for your account.
              </p>
            </div>

            <form className="space-y-6">
              <Input
                id="new-password"
                type="password"
                label="New password"
                placeholder="Enter new password"
                iconRight={<EyeOff size={20} className="cursor-pointer" />}
                required
              />

              <Input
                id="confirm-password"
                type="password"
                label="Re-enter new password"
                placeholder="Confirm new password"
                iconRight={<EyeOff size={20} className="cursor-pointer" />}
                required
              />

              <div className="pt-2">
                <Button variant="primary" colorTheme="green" className="w-full h-14 text-green-100">
                  Save new password
                </Button>
              </div>
            </form>

            <p className="text-[10px] text-gray-400 leading-relaxed">
              This site is protected by reCAPTCHA and the
              <a href="#" className="underline mx-1">Google Privacy Policy</a> and
              <a href="#" className="underline mx-1">Terms of Service</a> apply.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}