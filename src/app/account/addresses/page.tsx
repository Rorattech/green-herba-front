"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/Button";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultBilling,
  setDefaultShipping,
  type Address,
  type CreateAddressBody,
} from "@/src/services/api/addresses";
import { MapPin, Plus, Pencil, Trash2, Truck, CreditCard } from "lucide-react";

const emptyForm: CreateAddressBody = {
  label: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  postal_code: "",
  country: "Brasil",
};

export default function AccountAddressesPage() {
  const [list, setList] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateAddressBody & { id?: number }>(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    getAddresses()
      .then(setList)
      .catch(() => setError("Erro ao carregar endereços."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(addr: Address) {
    setForm({
      label: addr.label,
      street: addr.street,
      number: addr.number,
      complement: addr.complement ?? "",
      district: addr.district,
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
      country: addr.country,
      is_default_billing: addr.is_default_billing,
      is_default_shipping: addr.is_default_shipping,
      id: addr.id,
    });
    setEditingId(addr.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const body = {
        label: form.label,
        street: form.street,
        number: form.number,
        complement: form.complement || undefined,
        district: form.district,
        city: form.city,
        state: form.state,
        postal_code: form.postal_code,
        country: form.country,
        is_default_billing: form.is_default_billing,
        is_default_shipping: form.is_default_shipping,
      };
      if (editingId != null) {
        await updateAddress(editingId, body);
      } else {
        await createAddress(body);
      }
      closeForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Excluir este endereço?")) return;
    setError(null);
    try {
      await deleteAddress(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir.");
    }
  }

  async function handleSetDefaultShipping(id: number) {
    try {
      await setDefaultShipping(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao definir endereço de entrega.");
    }
  }

  async function handleSetDefaultBilling(id: number) {
    try {
      await setDefaultBilling(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao definir endereço de cobrança.");
    }
  }

  if (!list.length && !showForm && !loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-h5 font-heading text-green-800">Endereços</h2>
        <p className="text-body-m text-green-800/70">Cadastre um endereço para entrega e cobrança.</p>
        {error && <p className="text-body-s text-error font-medium">{error}</p>}
        <Button type="button" variant="primary" colorTheme="green" iconLeft={<Plus size={18} />} onClick={openCreate} className="text-green-100">
          Adicionar endereço
        </Button>
        {showForm && (
          <form className="border border-gray-200 rounded-lg p-6 space-y-4 bg-gray-50" onSubmit={handleSubmit}>
            <h3 className="text-h6 font-heading text-green-800">{editingId ? "Editar endereço" : "Novo endereço"}</h3>
            <input name="label" placeholder="Ex: Casa" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} className="w-full border rounded px-3 py-2" required />
            <input name="street" placeholder="Rua" value={form.street} onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))} className="w-full border rounded px-3 py-2" required />
            <div className="grid grid-cols-2 gap-2">
              <input name="number" placeholder="Número" value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} className="w-full border rounded px-3 py-2" required />
              <input name="complement" placeholder="Complemento" value={form.complement} onChange={(e) => setForm((f) => ({ ...f, complement: e.target.value }))} className="w-full border rounded px-3 py-2" />
            </div>
            <input name="district" placeholder="Bairro" value={form.district} onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))} className="w-full border rounded px-3 py-2" required />
            <div className="grid grid-cols-2 gap-2">
              <input name="city" placeholder="Cidade" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="w-full border rounded px-3 py-2" required />
              <input name="state" placeholder="Estado" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} className="w-full border rounded px-3 py-2" required />
            </div>
            <input name="postal_code" placeholder="CEP" value={form.postal_code} onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))} className="w-full border rounded px-3 py-2" required />
            <input name="country" placeholder="País" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="w-full border rounded px-3 py-2" required />
            <div className="flex gap-4 pt-2">
              <Button type="submit" variant="primary" colorTheme="green" disabled={saving} className="text-green-100">{saving ? "Salvando…" : "Salvar"}</Button>
              <Button type="button" variant="outline" colorTheme="gray" onClick={closeForm}>Cancelar</Button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-h5 font-heading text-green-800">Endereços</h2>
        <Button type="button" variant="primary" colorTheme="green" iconLeft={<Plus size={18} />} onClick={openCreate} className="text-green-100">
          Adicionar endereço
        </Button>
      </div>
      {error && <p className="text-body-s text-error font-medium">{error}</p>}
      {loading ? (
        <p className="text-body-m text-gray-500">Carregando…</p>
      ) : (
        <ul className="space-y-4">
          {list.map((addr) => (
            <li key={addr.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-green-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-body-m font-medium text-green-800">{addr.label}</p>
                  <p className="text-body-s text-gray-600">
                    {addr.street}, {addr.number}
                    {addr.complement ? `, ${addr.complement}` : ""} — {addr.district}, {addr.city}/{addr.state} — CEP {addr.postal_code}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {addr.is_default_shipping && (
                      <span className="inline-flex items-center gap-1 text-body-s text-green-700 bg-green-100 px-2 py-0.5 rounded">
                        <Truck size={14} /> Entrega
                      </span>
                    )}
                    {addr.is_default_billing && (
                      <span className="inline-flex items-center gap-1 text-body-s text-green-700 bg-green-100 px-2 py-0.5 rounded">
                        <CreditCard size={14} /> Cobrança
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => handleSetDefaultShipping(addr.id)} className="text-body-s text-green-800 hover:underline flex items-center gap-1" title="Usar como endereço de entrega">
                  <Truck size={14} /> Entrega
                </button>
                <button type="button" onClick={() => handleSetDefaultBilling(addr.id)} className="text-body-s text-green-800 hover:underline flex items-center gap-1" title="Usar como endereço de cobrança">
                  <CreditCard size={14} /> Cobrança
                </button>
                <button type="button" onClick={() => openEdit(addr)} className="text-body-s text-green-800 hover:underline flex items-center gap-1">
                  <Pencil size={14} /> Editar
                </button>
                <button type="button" onClick={() => handleDelete(addr.id)} className="text-body-s text-error hover:underline flex items-center gap-1">
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <form className="border border-gray-200 rounded-lg p-6 space-y-4 bg-gray-50" onSubmit={handleSubmit}>
          <h3 className="text-h6 font-heading text-green-800">{editingId ? "Editar endereço" : "Novo endereço"}</h3>
          <input name="label" placeholder="Ex: Casa, Trabalho" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-body-m" required />
          <input name="street" placeholder="Rua" value={form.street} onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-body-m" required />
          <div className="grid grid-cols-2 gap-2">
            <input name="number" placeholder="Número" value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-body-m" required />
            <input name="complement" placeholder="Complemento" value={form.complement} onChange={(e) => setForm((f) => ({ ...f, complement: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-body-m" />
          </div>
          <input name="district" placeholder="Bairro" value={form.district} onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-body-m" required />
          <div className="grid grid-cols-2 gap-2">
            <input name="city" placeholder="Cidade" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-body-m" required />
            <input name="state" placeholder="UF" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-body-m" required />
          </div>
          <input name="postal_code" placeholder="CEP" value={form.postal_code} onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-body-m" required />
          <input name="country" placeholder="País" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-body-m" required />
          <div className="flex gap-4 pt-2">
            <Button type="submit" variant="primary" colorTheme="green" disabled={saving} className="text-green-100">{saving ? "Salvando…" : "Salvar"}</Button>
            <Button type="button" variant="outline" colorTheme="gray" onClick={closeForm}>Cancelar</Button>
          </div>
        </form>
      )}
    </div>
  );
}
