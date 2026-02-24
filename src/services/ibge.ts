/**
 * IBGE API - estados e municípios do Brasil.
 * https://servicodados.ibge.gov.br/api/docs/localidades
 */

export interface IbgeEstado {
  id: number;
  sigla: string;
  nome: string;
}

export interface IbgeMunicipio {
  id: number;
  nome: string;
}

export async function fetchEstados(): Promise<IbgeEstado[]> {
  const res = await fetch(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function fetchMunicipiosByEstadoId(estadoId: number): Promise<IbgeMunicipio[]> {
  const res = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios?orderBy=nome`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) return [];
  return res.json();
}
