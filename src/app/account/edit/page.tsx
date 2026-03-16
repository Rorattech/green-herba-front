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
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value?.trim() || "";
    const rawPhone = (form.elements.namedItem("phone") as HTMLInputElement)?.value?.trim() || "";
    const rawDoc = (form.elements.namedItem("document_number") as HTMLInputElement)?.value?.trim() || "";
    const phone = rawPhone ? rawPhone.replace(/\D/g, "") : undefined;
    const document_number = rawDoc ? rawDoc.replace(/\D/g, "") : undefined;
    setLoading(true);
    try {
      const updated = await updateProfile({ name: name || undefined, phone, document_number });
      updateUser({
        name: updated.name,
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
        <Input
          name="name"
          id="name"
          label="Nome completo"
          placeholder="Seu nome completo"
          colorTheme="light"
          defaultValue={user.name ?? ""}
          required
        />
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
          label="Telefone"
          placeholder="(00) 00000-0000"
          colorTheme="light"
          mask="(99) 99999-9999"
          defaultValue={user.phone ?? ""}
        />
        <Input
          name="document_number"
          id="document_number"
          label="CPF"
          placeholder="000.000.000-00"
          colorTheme="light"
          mask="999.999.999-99"
          defaultValue={user.document_number ?? ""}
        />
        <Button type="submit" variant="primary" colorTheme="green" className="h-12 text-green-100" disabled={loading}>
          {loading ? "Salvando…" : "Salvar alterações"}
        </Button>
      </form>
    </div>
  );
}
