# Integração Mercado Pago — Checklist e requisitos

Este doc resume o que o **frontend** faz e o que o **backend** precisa fazer para a integração ficar em conformidade com o Mercado Pago (checklist de qualidade) e evitar pagamentos com status cancelado.

---

## Fluxo atual (Checkout Bricks)

1. **Frontend** chama `POST /api/orders/:id/payment/preference` → backend deve criar uma **Preferência** no MP e retornar `{ preference_id, public_key }`.
2. **Frontend** exibe o Payment Brick (amount + preferenceId), usuário escolhe método e preenche dados.
3. **Frontend** no `onSubmit` do Brick chama `POST /api/orders/:id/payment/process` com o payload abaixo.
4. **Backend** deve criar o **Pagamento** na API do Mercado Pago (POST `/v1/payments`) e atualizar o pedido conforme o resultado.

---

## O que o BACKEND precisa fazer

### Ao criar a Preferência (payment/preference)

Recomendações do checklist Mercado Pago:

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| **notification_url** | Sim | URL do seu backend que recebe webhooks do MP (ex.: `https://seu-dominio.com/api/webhooks/mercadopago`). Sem isso, o MP não notifica status do pagamento. |
| **external_reference** | Sim | ID único do pedido (ex.: `order_id` ou `order_number`) para conciliar `payment_id` do MP com o pedido interno. |
| **statement_descriptor** | Recomendado | Nome que aparece na fatura do cartão (ex.: "GREEN HERBA"). Reduz contestações. |
| **payer.email** | Recomendado | Melhora taxa de aprovação e antifraude. |
| **payer.first_name** / **payer.last_name** | Recomendado | Idem. |
| **items** | Sim | Incluir `id`, `title`, `quantity`, `unit_price`, `description`, `category_id` quando possível. |

Sem `notification_url` e `external_reference`, a integração fica incompleta e o MP pode não conseguir notificar o status (inclusive cancelamento).

### Ao criar o Pagamento (payment/process)

**Importante:** para pagamento com **cartão**, o backend deve criar um **novo pagamento** via POST `/v1/payments` usando o **token** e os dados enviados pelo frontend. **Não** use o `preference_id` para criar esse pagamento — a preferência serve para Wallet/redirect; para cartão é obrigatório criar o payment com o token. Se o backend criar o pagamento de forma errada (ex.: vinculado só à preferência sem token), o MP pode deixar o pagamento em estado cancelado ou rejeitado.

Quando o frontend envia o payload (token, payment_method_id, etc.), o backend deve chamar a **API de Pagamentos** do Mercado Pago (POST `/v1/payments`) com:

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| **token** | Sim (cartão) | Enviado pelo frontend (Brick gera o token). |
| **payment_method_id** | Sim | Ex.: `visa`, `master`, `amex`. |
| **transaction_amount** | Sim | Valor numérico (ex.: 99.90). |
| **installments** | Sim | Número de parcelas. |
| **issuer_id** | Condicional | Para cartão, quando aplicável. |
| **payer** | Sim | `email` obrigatório; `identification` (type + number) recomendado. |
| **external_reference** | Sim | Mesmo identificador do pedido (ex.: `order_id` ou `order_number`) para o webhook e conciliação. **Sem isso, o pagamento pode não ser associado ao pedido e o fluxo pode quebrar.** |
| **description** | Recomendado | Ex.: "Pedido #12345". |

- **Cartão:** criar o payment **sem** enviar `preference_id` no body. A preferência é só para Wallet/outros; pagamento com cartão é sempre com `token` + `transaction_amount` + `payer` + `payment_method_id` + `installments` + `external_reference`.
- Usar **idempotency key** (header `X-Idempotency-Key`) na chamada à API do MP para evitar duplicar pagamento em retentativas.
- Se o método for **ticket** ou **boleto**, o Brick não envia `token`; o backend deve tratar outro fluxo (criação de payment com `payment_method_id` de boleto e dados do payer). O frontend envia `payment_type` (ex.: `"ticket"`) para o backend saber qual fluxo usar.
- **Idempotency-Key:** use um header `X-Idempotency-Key` com valor único por tentativa (ex.: `order_id + timestamp` ou UUID) para evitar criar o mesmo pagamento duas vezes se o front reenviar.

### Por que o pagamento pode vir “cancelado”

- **Preferência** criada sem `notification_url`: o MP não notifica; o backend pode não atualizar o pedido ou pode interpretar mal o status.
- **Pagamento** criado sem `external_reference`: o webhook traz o `payment_id` mas não há como saber a qual pedido pertence; o backend pode não atualizar o pedido ou pode marcar como cancelado por falta de mapeamento.
- **Pagamento** criado com dados incompletos ou inválidos (valor, payer, etc.): o MP pode recusar ou deixar o pagamento em estado estranho (ex.: cancelado).
- **Webhook** não implementado ou com URL errada: o backend não recebe atualizações de status (approved, rejected, cancelled).

---

## O que o FRONTEND envia em `POST /orders/:id/payment/process`

O frontend mapeia o `formData` do Payment Brick para o corpo da requisição. Exemplo (pagamento com cartão):

```json
{
  "token": "...",
  "payment_method_id": "visa",
  "transaction_amount": 99.9,
  "installments": 1,
  "issuer_id": "310",
  "payer": {
    "email": "comprador@email.com",
    "first_name": "Nome",
    "identification": { "type": "CPF", "number": "12345678900" }
  },
  "payment_type": "credit_card",
  "order_id": 123
}
```

- O backend já conhece o `order_id` pela URL (`/orders/:id/payment/process`).
- O backend **deve** usar esse `order_id` (ou o `order_number`) como `external_reference` na chamada ao MP.
- Para **ticket/boleto**, o frontend pode enviar `payment_type: "ticket"` e o mesmo `formData` (sem token); o backend deve criar o payment com o método correspondente.

---

## Webhook

- O backend deve expor um endpoint (ex.: `POST /api/webhooks/mercadopago`) e registrar essa URL em **notification_url** da preferência (e, se aplicável, no painel do MP).
- No webhook, usar o `payment_id` (ou o que vier no payload) para consultar o pagamento na API do MP e obter o status; usar `external_reference` para encontrar o pedido e atualizar o status (approved, rejected, cancelled, etc.).

---

## Resumo rápido

1. **Preferência:** sempre com `notification_url`, `external_reference`, `statement_descriptor` e dados do payer/items.
2. **Pagamento (cartão):** sempre com `external_reference` (id do pedido), token, valor, payer e idempotency.
3. **Webhook:** implementado e apontando para a URL configurada na preferência.

Se os pagamentos ainda aparecerem como cancelados após isso, o próximo passo é inspecionar a resposta da API do MP ao criar o pagamento e o payload do webhook (e os logs do backend) para ver o status exato retornado pelo MP.

---

## Avaliar um pagamento específico (MCP)

Se você tiver um **payment_id** do Mercado Pago (de um pagamento que veio cancelado ou com problema), pode usar a ferramenta de avaliação de qualidade do MCP Mercado Pago com esse ID para ver o diagnóstico e recomendações. No Cursor, isso pode ser feito via MCP com o `payment_id` em questão.
