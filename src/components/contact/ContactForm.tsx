"use client";

import { useState } from "react";
import { ApiError } from "@/src/lib/api-client";
import { Input } from "@/src/components/ui/Input";
import { TextArea } from "@/src/components/ui/TextArea";
import { Button } from "@/src/components/ui/Button";
import { submitContactMessage } from "@/src/services/api/contact";

function firstError(errors: Record<string, string[]> | undefined, key: string): string | undefined {
  const list = errors?.[key];
  return list?.[0];
}

export function ContactForm() {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"name" | "email" | "phone" | "subject" | "message", string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(null);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value?.trim() ?? "";
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim() ?? "";
    const rawPhone = (form.elements.namedItem("phone") as HTMLInputElement)?.value?.trim() ?? "";
    const phone = rawPhone ? rawPhone.replace(/\D/g, "") : "";
    const subject = (form.elements.namedItem("subject") as HTMLInputElement)?.value?.trim() ?? "";
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value?.trim() ?? "";

    if (!name || !email || !subject || !message) {
      setError("Preencha nome, e-mail, assunto e mensagem.");
      return;
    }
    if (message.length < 10) {
      setError("A mensagem deve ter pelo menos 10 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const res = await submitContactMessage({
        name,
        email,
        ...(phone ? { phone } : {}),
        subject,
        message,
      });
      setSuccess(res.message || "Mensagem enviada com sucesso.");
      form.reset();
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setFieldErrors({
          name: firstError(err.errors, "name"),
          email: firstError(err.errors, "email"),
          phone: firstError(err.errors, "phone"),
          subject: firstError(err.errors, "subject"),
          message: firstError(err.errors, "message"),
        });
      }
      setError(err instanceof Error ? err.message : "Não foi possível enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {error ? (
        <p className="text-body-s text-error font-medium" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-body-s text-green-800 bg-green-100 border border-green-200 rounded-2xl px-4 py-3" role="status">
          {success}
        </p>
      ) : null}

      <div>
        <Input
          label="Nome"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Seu nome"
          required
          disabled={loading}
          error={Boolean(fieldErrors.name)}
          colorTheme="light"
        />
        {fieldErrors.name ? <p className="text-body-s text-error mt-1">{fieldErrors.name}</p> : null}
      </div>

      <div>
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          required
          disabled={loading}
          error={Boolean(fieldErrors.email)}
          colorTheme="light"
        />
        {fieldErrors.email ? <p className="text-body-s text-error mt-1">{fieldErrors.email}</p> : null}
      </div>

      <div>
        <Input
          label="Telefone (opcional)"
          name="phone"
          type="tel"
          autoComplete="tel"
          mask="(99) 99999-9999"
          placeholder="(00) 00000-0000"
          disabled={loading}
          error={Boolean(fieldErrors.phone)}
          colorTheme="light"
        />
        {fieldErrors.phone ? <p className="text-body-s text-error mt-1">{fieldErrors.phone}</p> : null}
      </div>

      <div>
        <Input
          label="Assunto"
          name="subject"
          type="text"
          placeholder="Sobre o que é sua mensagem?"
          required
          disabled={loading}
          error={Boolean(fieldErrors.subject)}
          colorTheme="light"
        />
        {fieldErrors.subject ? <p className="text-body-s text-error mt-1">{fieldErrors.subject}</p> : null}
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-body-s font-medium text-green-800 mb-2">
          Mensagem
        </label>
        <TextArea
          id="contact-message"
          name="message"
          required
          disabled={loading}
          error={Boolean(fieldErrors.message)}
          colorTheme="light"
          className="min-h-[140px] resize-y"
          placeholder="Descreva sua dúvida ou solicitação (mín. 10 caracteres)."
        />
        {fieldErrors.message ? <p className="text-body-s text-error mt-1">{fieldErrors.message}</p> : null}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          colorTheme="green"
          className="w-full h-14 text-body-m text-green-100"
          disabled={loading}
        >
          {loading ? "Enviando…" : "Enviar mensagem"}
        </Button>
      </div>
    </form>
  );
}
