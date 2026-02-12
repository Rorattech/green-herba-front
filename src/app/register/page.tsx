"use client";

import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/src/layouts/MainLayout";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { EyeOff } from "lucide-react";

export default function RegisterPage() {
  return (
    <MainLayout>
      <section className="bg-white min-h-[calc(100vh-180px)] flex flex-col md:flex-row">

        <div className="relative w-full md:w-1/2 h-[300px] md:h-auto overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1532765488483-62ff440ee4fd?q=90&w=1920"
            alt="Green Herba Pharma Life"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-white font-heading text-h3 md:text-h2 lg:text-h1 whitespace-nowrap opacity-90">
              Green Herba Pharma &nbsp; Green Herba Pharma &nbsp; Green Herba Pharma
            </h2>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
          <div className="w-full max-w-[440px] space-y-8">
            <h1 className="text-h2 font-heading text-green-800">Create an account</h1>

            <form className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <Input label="First name" id="first-name" placeholder="Enter your first name" required />
                <Input label="Last name" id="last-name" placeholder="Enter your last name" required />
              </div>

              <Input label="Email" id="email" type="email" placeholder="Enter your email" required />

              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="Create a password"
                iconRight={<EyeOff size={20} className="cursor-pointer" />}
                required
              />

              <label className="flex items-start gap-3 cursor-pointer group pt-2">
                <input type="checkbox" className="mt-1 w-4 h-4 accent-green-800" />
                <span className="text-body-s text-green-800 leading-tight">
                  Opt out of Green Herba Pharma's marketing emails packed with exciting news and offers
                </span>
              </label>

              <div className="space-y-4 pt-4">
                <Button variant="primary" colorTheme="green" className="w-full h-14 text-green-100">
                  Join now
                </Button>

                <Link href="/login" className="block text-center">
                  <Button variant="primary" colorTheme="pistachio" className="w-full h-14">
                    Back to sign in
                  </Button>
                </Link>
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