/**
 * Gera hash SHA-256 da senha em texto.
 * O valor é enviado ao backend, que deve fazer bcrypt desse hash antes de armazenar.
 * Assim a senha em texto nunca trafega na rede.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainPassword);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
