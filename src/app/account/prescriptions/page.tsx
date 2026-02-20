"use client";

import { useMemo, useRef, useState } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { getPrescriptionsByUser, addPrescription } from "@/src/services/mock-account";
import { Button } from "@/src/components/ui/Button";
import type { PrescriptionStatus } from "@/src/types/prescription";
import { Upload, CheckCircle, XCircle, Clock } from "lucide-react";

const statusConfig: Record<PrescriptionStatus, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Em análise", icon: Clock, className: "text-warning" },
  approved: { label: "Aprovada", icon: CheckCircle, className: "text-success" },
  rejected: { label: "Rejeitada", icon: XCircle, className: "text-error" },
};

export default function AccountPrescriptionsPage() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prescriptions = useMemo(() => (user ? getPrescriptionsByUser(user.id) : []), [user]);

  if (!user) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    // Mock: não envia para servidor; cria registro local com status "pending"
    const reader = new FileReader();
    reader.onload = () => {
      addPrescription({
        id: `rx-${Date.now()}`,
        userId: user.id,
        fileName: file.name,
        fileUrl: typeof reader.result === "string" ? reader.result : "",
        status: "pending",
        submittedAt: new Date().toISOString(),
      });
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-h5 font-heading text-green-800">Prescrições médicas</h2>
      <p className="text-body-m text-green-800/70 max-w-lg">
        Envie sua prescrição médica para liberação de compra. Você poderá acompanhar aqui se foi aprovada.
      </p>

      <div className="flex flex-wrap gap-4 items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="primary"
          colorTheme="green"
          iconLeft={<Upload size={18} />}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-green-100"
        >
          {uploading ? "Enviando…" : "Enviar prescrição"}
        </Button>
      </div>

      {prescriptions.length === 0 ? (
        <p className="text-body-m text-gray-400">Nenhuma prescrição enviada ainda.</p>
      ) : (
        <ul className="space-y-4">
          {prescriptions.map((p) => {
            const config = statusConfig[p.status];
            const Icon = config.icon;
            return (
              <li
                key={p.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={config.className} />
                  <div>
                    <p className="text-body-m font-medium text-green-800">{p.fileName}</p>
                    <p className="text-body-s text-gray-500">
                      Enviada em {new Date(p.submittedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <span className={`text-body-s font-medium ${config.className}`}>
                  {config.label}
                </span>
                {p.status === "rejected" && p.rejectionReason && (
                  <p className="w-full text-body-s text-gray-500 mt-2">{p.rejectionReason}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
