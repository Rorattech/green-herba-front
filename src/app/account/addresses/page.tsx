"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
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
import { fetchByCep } from "@/src/services/viacep";
import { fetchEstados, fetchMunicipiosByEstadoId, type IbgeEstado, type IbgeMunicipio } from "@/src/services/ibge";
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

const inputBaseClass = "w-full border border-gray-300 rounded-full px-6 py-4 text-body-m font-medium bg-gray-100 border-gray-200 text-green-800 placeholder:text-gray-400 focus:border-green-700 outline-none transition-all duration-200";

export default function AccountAddressesPage() {
  const [list, setList] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateAddressBody & { id?: number }>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [estados, setEstados] = useState<IbgeEstado[]>([]);
  const [municipios, setMunicipios] = useState<IbgeMunicipio[]>([]);
  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    fetchEstados().then(setEstados);
  }, []);

  const selectedEstadoId = form.state ? estados.find((e) => e.sigla === form.state)?.id : null;
  useEffect(() => {
    if (selectedEstadoId == null) {
      setMunicipios([]);
      return;
    }
    fetchMunicipiosByEstadoId(selectedEstadoId).then(setMunicipios);
  }, [selectedEstadoId]);

  const handleCepBlur = useCallback(async () => {
    const digits = form.postal_code.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const data = await fetchByCep(form.postal_code);
      if (data) {
        setForm((f) => ({
          ...f,
          street: data.logradouro || f.street,
          district: data.bairro || f.district,
          city: data.localidade || f.city,
          state: data.uf || f.state,
        }));
      }
    } finally {
      setCepLoading(false);
    }
  }, [form.postal_code]);

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
    setMunicipios([]);
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
      postal_code: addr.postal_code.replace(/\D/g, "").length === 8 ? addr.postal_code.replace(/(\d{5})(\d{3})/, "$1-$2") : addr.postal_code,
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
    setMunicipios([]);
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
        postal_code: form.postal_code.replace(/\D/g, ""),
        country: "Brasil",
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

  const addressForm = (
    <form className="border border-gray-200 rounded-lg p-6 space-y-4 bg-gray-50" onSubmit={handleSubmit}>
      <h3 className="text-h6 font-heading text-green-800">{editingId ? "Editar endereço" : "Novo endereço"}</h3>

      <Input
        name="label"
        id="address-label"
        label="Apelido"
        placeholder="Ex: Casa, Trabalho"
        colorTheme="light"
        value={form.label}
        onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
        required
      />

      <div className="relative">
        <Input
          name="postal_code"
          id="postal_code"
          label="CEP"
          placeholder="00000-000"
          colorTheme="light"
          mask="99999-999"
          value={form.postal_code}
          onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
          onBlur={handleCepBlur}
          required
        />
        {cepLoading && (
          <span className="absolute right-4 top-[42px] text-body-s text-gray-400">Buscando…</span>
        )}
      </div>

      <Input
        name="street"
        id="street"
        label="Rua"
        placeholder="Logradouro"
        colorTheme="light"
        value={form.street}
        onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="number"
          id="number"
          label="Número"
          placeholder="Nº"
          colorTheme="light"
          value={form.number}
          onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
          required
        />
        <Input
          name="complement"
          id="complement"
          label="Complemento"
          placeholder="Apto, bloco…"
          colorTheme="light"
          value={form.complement}
          onChange={(e) => setForm((f) => ({ ...f, complement: e.target.value }))}
        />
      </div>
      <Input
        name="district"
        id="district"
        label="Bairro"
        placeholder="Bairro"
        colorTheme="light"
        value={form.district}
        onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
        required
      />

      <div>
        <label htmlFor="state" className="block mb-1.5 text-body-s font-medium uppercase tracking-wider text-gray-400">
          Estado (UF)
        </label>
        <select
          id="state"
          name="state"
          value={form.state}
          onChange={(e) => setForm((f) => ({ ...f, state: e.target.value, city: "" }))}
          required
          className={inputBaseClass}
        >
          <option value="">Selecione o estado</option>
          {estados.map((e) => (
            <option key={e.id} value={e.sigla}>
              {e.nome} ({e.sigla})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city" className="block mb-1.5 text-body-s font-medium uppercase tracking-wider text-gray-400">
          Cidade
        </label>
        <select
          id="city"
          name="city"
          value={form.city}
          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          required
          className={inputBaseClass}
          disabled={!form.state || municipios.length === 0}
        >
          <option value="">Selecione a cidade</option>
          {municipios.map((m) => (
            <option key={m.id} value={m.nome}>
              {m.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 pt-2">
        <Button type="submit" variant="primary" colorTheme="green" disabled={saving} className="text-green-100">
          {saving ? "Salvando…" : "Salvar"}
        </Button>
        <Button type="button" variant="outline" colorTheme="gray" onClick={closeForm}>
          Cancelar
        </Button>
      </div>
    </form>
  );

  if (!list.length && !showForm && !loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-h5 font-heading text-green-800">Endereços</h2>
        <p className="text-body-m text-green-800/70">Cadastre um endereço para entrega e cobrança.</p>
        {error && <p className="text-body-s text-error font-medium">{error}</p>}
        <Button type="button" variant="primary" colorTheme="green" iconLeft={<Plus size={18} />} onClick={openCreate} className="text-green-100">
          Adicionar endereço
        </Button>
        {showForm && addressForm}
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

      {showForm && addressForm}
    </div>
  );
}
