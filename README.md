# Frontend Structure (Next)

Esta pasta contém a base do frontend Next.js para o projeto de e-commerce.

Estrutura sugerida:

- `app/` - rotas e layouts do Next (já existente).
- `components/` - componentes reutilizáveis (subpastas `ui/`, `product/`).
- `lib/` - helpers e integrações com API (ex: `lib/api.ts`).
- `services/` - wrappers e clients para serviços externos.
- `hooks/` - custom React hooks.
- `contexts/` - providers e contextos React.
- `store/` - estado global (Redux, Zustand, etc.).
- `types/` - tipos TypeScript compartilhados.
- `utils/` - funções utilitárias.
- `public/assets/` - imagens e assets públicos.
- `tests/` - testes de frontend.

Exemplos criados (movidos para `src/`):

- `src/components/ui/Button.tsx` - botão reutilizável (exemplo para estilos e testes).
- `src/components/product/ProductCard.tsx` - cartão de produto de exemplo.
- `src/hooks/useFetch.tsx` - hook cliente simples para requisições.
- `src/contexts/AuthContext.tsx` - provider e hook de autenticação de exemplo.
- `src/layouts/MainLayout.tsx` - layout base.
- `src/services/cartService.ts` - wrappers de serviço de carrinho (placeholders para futura API).
- `src/types/index.ts` - tipos TypeScript compartilhados.
- `src/utils/format.ts` - helper para formatação de moeda.
- `src/store/README.md` - explicação do diretório `store` (sem implementação de estado ainda).
- `src/lib/api.ts` - helper para integração com a API (moved from page.tsx).
- `jest` config and example tests in `src/lib/__tests__` and `src/tests/`.

Observações:

- A conexão com a API foi retirada de `app/page.tsx` e centralizada em `lib/api.ts`.
- Não implementamos features de e-commerce ainda — apenas a base de pastas e o helper de exemplo.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Makefile helpers

For common tasks you can use the provided `Makefile` from the project root:

```bash
# Show all available commands
make help

# Node / Next.js commands (no Docker)
make install      # npm install
make dev          # npm run dev (http://localhost:3000)
make build        # npm run build
make start        # npm run start
make lint         # npm run lint
make test         # npm test
make test-watch   # npm run test:watch

# Docker Compose commands
make dc-build     # docker compose build
make dc-up        # docker compose up -d
make dc-down      # docker compose down
make dc-logs      # docker compose logs -f
make dc-restart   # docker compose restart (down + up -d)
```
