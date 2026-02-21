"use client";

import { useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { updateProfile } from "@/src/services/api/profile";

export default function AccountEditPage() {
  const { user, updateUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const firstName = (form.elements.namedItem("first-name") as HTMLInputElement)?.value?.trim();
    const lastName = (form.elements.namedItem("last-name") as HTMLInputElement)?.value?.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement)?.value?.trim() || undefined;
    const document_number = (form.elements.namedItem("document_number") as HTMLInputElement)?.value?.trim() || undefined;
    updateUser({ firstName, lastName });
    setLoading(true);
    try {
      const updated = await updateProfile({ phone, document_number });
      updateUser({
        phone: updated.phone,
        document_number: updated.document_number,
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[440px] space-y-6">
      <h2 className="text-h5 font-heading text-green-800">Editar conta</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {saved && (
          <p className="text-body-s text-success font-medium">Dados salvos com sucesso.</p>
        )}
        {error && <p className="text-body-s text-error font-medium">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            name="first-name"
            id="first-name"
            label="Nome"
            placeholder="Seu nome"
            colorTheme="light"
            defaultValue={user.firstName ?? user.name?.split(" ")[0]}
          />
          <Input
            name="last-name"
            id="last-name"
            label="Sobrenome"
            placeholder="Seu sobrenome"
            colorTheme="light"
            defaultValue={user.lastName ?? user.name?.split(" ").slice(1).join(" ")}
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
          disabled
          title="O email não pode ser alterado aqui."
        />
        <Input
          name="phone"
          id="phone"
          type="tel"
          label="Telefone"
          placeholder="(00) 00000-0000"
          colorTheme="light"
          defaultValue={user.phone ?? ""}
        />
        <Input
          name="document_number"
          id="document_number"
          label="CPF / Documento"
          placeholder="Apenas números"
          colorTheme="light"
          defaultValue={user.document_number ?? ""}
        />
        <Button type="submit" variant="primary" colorTheme="green" className="h-12 text-green-100" disabled={loading}>
          {loading ? "Salvando…" : "Salvar alterações"}
        </Button>
      </form>
    </div>
  );
}
