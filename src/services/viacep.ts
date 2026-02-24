/**
 * ViaCEP - consulta CEP e retorna logradouro, bairro, cidade e UF.
 * https://viacep.com.br
 */

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  erro?: boolean;
}

export async function fetchByCep(cep: string): Promise<ViaCepResponse | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const data: ViaCepResponse & { erro?: boolean } = await res.json();
  if (data.erro) return null;
  return data;
}
