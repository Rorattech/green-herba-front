"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getPrescriptions, uploadPrescription } from "@/src/services/api/prescriptions";
import { getProducts } from "@/src/services/api/products";
import { Button } from "@/src/components/ui/Button";
import type { ApiPrescription } from "@/src/types/api-resources";
import type { ApiProduct } from "@/src/types/api";
import { Upload, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { Select } from "@/src/components/ui/Select";

const statusConfig: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending: { label: "Em análise", icon: Clock, className: "text-warning" },
  approved: { label: "Aprovada", icon: CheckCircle, className: "text-success" },
  declined: { label: "Rejeitada", icon: XCircle, className: "text-error" },
};

function PrescriptionsContent() {
  const searchParams = useSearchParams();
  const missingPrescription = searchParams.get("missing_prescription") === "1";
  const productIdFromUrl = searchParams.get("product_id");
  const [prescriptions, setPrescriptions] = useState<ApiPrescription[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>(productIdFromUrl ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      getPrescriptions({ per_page: 20 }).then((res) => setPrescriptions(res.data ?? [])),
      getProducts({ per_page: 100, requires_prescription: true }).then((res) => setProducts(res.data ?? [])),
    ]).catch(() => setError("Erro ao carregar.")).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!products.length || !productIdFromUrl) return;
    const id = productIdFromUrl;
    const exists = products.some((p) => String(p.id) === id);
    if (exists) setSelectedProductId(id);
  }, [products, productIdFromUrl]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const productId = selectedProductId ? Number(selectedProductId) : null;
    if (!file || !productId) {
      if (!productId) setError("Selecione o produto relacionado à prescrição.");
      return;
    }
    // Apenas PDF, até 5MB
    const maxSizeBytes = 5 * 1024 * 1024;
    if (!file.type.includes("pdf")) {
      setError("Envie apenas arquivo em PDF (máx. 5MB).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    if (file.size > maxSizeBytes) {
      setError("O arquivo deve ter no máximo 5MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setError(null);
    setUploading(true);
    uploadPrescription(file, productId)
      .then(() => {
        return getPrescriptions({ per_page: 20 }).then((res) => setPrescriptions(res.data ?? []));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao enviar."))
      .finally(() => {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      });
  }

  if (loading) return <p className="text-body-m text-gray-500">Carregando…</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-h5 font-heading text-green-800">Prescrições médicas</h2>
      <p className="text-body-m text-green-800/70 max-w-lg">
        Envie sua prescrição médica em PDF (máx. 5MB) vinculada a um produto. Você poderá acompanhar aqui se foi aprovada.
      </p>

      {missingPrescription && (
        <div className="flex justify-center gap-3 p-4 rounded-lg bg-warning/15 border border-warning text-green-800">
          <AlertCircle size={22} className="shrink-0" />
          <p className="text-body-m">
            {(() => {
              const product = productIdFromUrl ? products.find((p) => String(p.id) === productIdFromUrl) : null;
              if (product) {
                return <>O produto <strong>{product.name}</strong> exige prescrição aprovada. Envie uma prescrição para este produto ou aguarde a aprovação das que já enviou para continuar a compra.</>;
              }
              return "Você tem produtos no carrinho que exigem prescrição aprovada. Envie uma prescrição para o produto ou aguarde a aprovação das que já enviou para continuar a compra.";
            })()}
          </p>
        </div>
      )}

      {error && <p className="text-body-s text-error font-medium">{error}</p>}

      <div className="flex flex-wrap gap-4 items-center">
        <div className="min-w-[300px]">
          <Select
            id="prescription-product"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full px-3 py-2 text-body-m"
          >
            <option value="">
              {products.length === 0 ? "Nenhum produto exige prescrição" : "Selecione o produto"}
            </option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="primary"
          colorTheme="green"
          iconLeft={<Upload size={18} />}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !selectedProductId}
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
            const config = statusConfig[p.status] ?? { label: p.status, icon: Clock, className: "text-gray-500" };
            const Icon = config.icon;
            return (
              <li
                key={p.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={config.className} />
                  <div>
                    <p className="text-body-m font-medium text-green-800">{p.file_path?.split(/[/\\]/).pop() ?? `Prescrição #${p.id}`}</p>
                    <p className="text-body-s text-gray-500">
                      Enviada em {new Date(p.uploaded_at).toLocaleDateString("pt-BR")}
                    </p>
                    {p.products && p.products.length > 0 && (
                      <p className="text-body-s text-green-800 mt-1">
                        Produto: {p.products.map((prod) => prod.name).join(", ")}
                      </p>
                    )}
                    {p.status_message && <p className="text-body-s text-gray-500 mt-1">{p.status_message}</p>}
                  </div>
                </div>
                <span className={`text-body-s font-medium ${config.className}`}>
                  {config.label}
                </span>
                {p.status === "rejected" && p.rejection_reason && (
                  <p className="w-full text-body-s text-gray-500 mt-2">{p.rejection_reason}</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function AccountPrescriptionsPage() {
  return (
    <Suspense fallback={<p className="text-body-m text-gray-500">Carregando…</p>}>
      <PrescriptionsContent />
    </Suspense>
  );
}
