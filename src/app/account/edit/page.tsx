"use client";

import { useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";

export default function AccountEditPage() {
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const firstName = (form.elements.namedItem("first-name") as HTMLInputElement)?.value?.trim();
    const lastName = (form.elements.namedItem("last-name") as HTMLInputElement)?.value?.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim();
    if (firstName !== undefined) updateUser({ firstName });
    if (lastName !== undefined) updateUser({ lastName });
    if (email !== undefined) updateUser({ email });
    setSaved(true);
  }

  return (
    <div className="max-w-[440px] space-y-6">
      <h2 className="text-h5 font-heading text-green-800">Editar conta</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {saved && (
          <p className="text-body-s text-success font-medium">Dados salvos com sucesso.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            name="first-name"
            id="first-name"
            label="Nome"
            placeholder="Seu nome"
            colorTheme="light"
            defaultValue={user.firstName}
          />
          <Input
            name="last-name"
            id="last-name"
            label="Sobrenome"
            placeholder="Seu sobrenome"
            colorTheme="light"
            defaultValue={user.lastName}
          />
        </div>
        <Input
          name="email"
          id="email"
          type="email"
          label="Email"
          placeholder="seu@email.com"
          colorTheme="light"
          defaultValue={user.email}
          required
        />
        <Button type="submit" variant="primary" colorTheme="green" className="h-12 text-green-100">
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}
