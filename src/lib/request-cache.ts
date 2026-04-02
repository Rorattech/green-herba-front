/**
 * Cache em memória com TTL + deduplicação de requisições em voo.
 * Mesma chave: uma única chamada à rede até resolver; respostas bem-sucedidas
 * reutilizadas dentro do TTL (lista de produtos, cupons, etc.).
 */
export function createRequestCache<T>(ttlMs: number) {
  const inflight = new Map<string, Promise<T>>();
  const store = new Map<string, { expires: number; value: T }>();

  return function getCached(key: string, producer: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const hit = store.get(key);
    if (hit && hit.expires > now) {
      return Promise.resolve(hit.value);
    }

    let pending = inflight.get(key);
    if (pending) return pending;

    pending = producer()
      .then((value) => {
        store.set(key, { value, expires: Date.now() + ttlMs });
        return value;
      })
      .finally(() => {
        inflight.delete(key);
      });

    inflight.set(key, pending);
    return pending;
  };
}
