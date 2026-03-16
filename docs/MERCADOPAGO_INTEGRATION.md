# Integração Mercado Pago — Checklist e requisitos

Este doc resume o que o **frontend** faz e o que o **backend** precisa fazer para a integração ficar em conformidade com o Mercado Pago (checklist de qualidade) e evitar pagamentos com status cancelado.

---

## Fluxo atual (Checkout Bricks)

1. **Frontend** chama `POST /api/orders/:id/payment/preference` → backend deve criar uma **Preferência** no MP e retornar `{ preference_id, public_key }`.
2. **Frontend** exibe o Payment Brick (amount + preferenceId), usuário escolhe método e preenche dados.
3. **Frontend** no `onSubmit` do Brick chama `POST /api/orders/:id/payment/process` com o payload abaixo.
4. **Backend** deve criar o **Pagamento** na API do Mercado Pago (POST `/v1/payments`) e atualizar o pedido conforme o resultado.
5. Quando o pagamento fica **pendente** (PIX/boleto), o backend devolve `payment_id` + dados extras (QR, boleto, links) e o frontend mostra:
   - Tela “Conclua seu pagamento” (QR Pix, link de boleto, resumo).
   - **Status Screen Brick** inicializado com o `payment_id` para acompanhar o status no MP.

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

## Integração FRONTEND — Payment Brick + Status Screen Brick

### Visão geral do fluxo no frontend

1. Usuário confirma o pedido no checkout.
2. Front chama `POST /api/orders/{order}/payment/preference` para obter:
   - `preference_id`
   - `public_key`
3. Front renderiza o **Payment Brick** usando `preference_id` e `public_key`.
4. No `onSubmit` do Payment Brick, o front envia os dados de pagamento para:
   - `POST /api/orders/{order}/payment/process`
5. Backend cria o pagamento no Mercado Pago e responde:
   - Com status final (`approved`, `rejected`) **ou**
   - Com status `pending` (Pix/Boleto) + dados extras (QR, boleto, links).
6. Front:
   - Para cartão: mostra resultado final (aprovado/recusado).
   - Para Pix/Boleto: mostra tela “Conclua seu pagamento” e instancia o **Status Screen Brick** usando `payment_id`.

### 1. Obter `preference_id` e `public_key`

**Requisição**

```http
POST /api/orders/{order_id}/payment/preference
Authorization: Bearer <token do usuário>
Content-Type: application/json
```

**Resposta esperada**

```json
{
  "preference_id": "<PREFERENCE_ID>",
  "public_key": "<MERCADOPAGO_PUBLIC_KEY>"
}
```

**O que o front faz hoje**

- Guarda `preference_id` e `public_key` no estado da página `/checkout/pay/[orderId]`.
- Chama `initMercadoPago(public_key)` e passa `preferenceId` para o componente `Payment` de `@mercadopago/sdk-react`.

### 2. Renderizar o Payment Brick (via `@mercadopago/sdk-react`)

Na página `CheckoutPayPage`:

- O componente `Payment` é importado dinamicamente:

```ts
const Payment = dynamic(
  () => import("@mercadopago/sdk-react").then((mod) => mod.Payment),
  { ssr: false }
);
```

- E é renderizado com:
  - `initialization.amount`
  - `initialization.preferenceId`
  - callbacks `onSubmit`, `onReady`, `onError`

### 3. Payload que o front envia em `onSubmit(formData)`

O front mapeia o `formData` do Payment Brick para o corpo da requisição `POST /api/orders/{order_id}/payment/process`.

**Payload (forma conceitual):**

```ts
const payload = {
  payment_method_id: formData.payment_method_id,
  payment_type: formData.payment_type,      // ex.: 'credit_card', 'debit_card', 'bank_transfer', 'ticket', etc.
  transaction_amount: formData.transaction_amount,
  installments: formData.installments,
  payer: {
    email: formData.payer.email,
    first_name: formData.payer.first_name,
    last_name: formData.payer.last_name,
    identification: formData.payer.identification, // { type, number }
    address: formData.payer.address,               // obrigatório e completo para boleto
  },
  token: formData.token ?? null,        // obrigatório apenas para cartão
  issuer_id: formData.issuer_id ?? null,
};
```

Na implementação real (`CheckoutPayPage`), isso é tipado como `ProcessPaymentBody` e enviado por `processPayment(orderId, body)`.

**Endpoint chamado**

```http
POST /api/orders/{order_id}/payment/process
Authorization: Bearer <token do usuário>
Content-Type: application/json
Body: <payload acima>
```

**Regras importantes do backend (que o front já respeita)**

- **Cartão (crédito/débito)**:
  - `payment_type` ≈ `'credit_card'` ou `'debit_card'`.
  - `token` **precisa** vir preenchido; se vier vazio o backend responde `422`.
- **Pix**:
  - `payment_method_id = 'pix'`.
  - `payment_type` geralmente `'bank_transfer'`.
  - Não precisa de `token` (pode ser omitido ou vazio).
- **Boleto**:
  - `payment_method_id = 'bolbradesco'`.
  - `payment_type` geralmente `'ticket'`.
  - Enviar `payer.address` completo:
    - `zip_code`, `street_name`, `street_number`,
    - `neighborhood`, `city`, `federal_unit`.

### 4. Estrutura da resposta do backend e tratamento no front

**Resposta de sucesso (conceito):**

```json
{
  "success": true,
  "payment_id": 5466310457,
  "status": "pending",
  "status_detail": "pending_waiting_transfer",
  "order_number": "PG-123456",

  "qr_code_base64": "....",
  "qr_code": "00020126600014...",
  "ticket_url": "https://...",
  "external_resource_url": "https://..."
}
```

O front converte `payment_id` para string e trata por método:

- **Cartão (crédito / débito)**
  - `status === 'approved'` → tela de sucesso / resumo do pedido.
  - Qualquer outro status (`rejected`, `cancelled`, etc.) → mensagem de erro e opção de tentar novamente / trocar meio de pagamento.
- **Pix**
  - `payment_method_id = 'pix'`, `status` geralmente `'pending'` (`pending_waiting_transfer`).
  - Front exibe:
    - QR code (`qr_code_base64`).
    - Código Pix copiável (`qr_code`).
    - Botão “Abrir página do pagamento” (`ticket_url`).
  - Front instancia o **Status Screen Brick** com `payment_id`.
- **Boleto**
  - `payment_method_id = 'bolbradesco'`, `status` geralmente `'pending'` (`pending_waiting_payment`).
  - Front exibe:
    - Link “Ver boleto” usando `external_resource_url` (nova aba).
  - Front instancia o **Status Screen Brick** com `payment_id`.

### 5. Status Screen Brick no frontend

O projeto usa a versão em React do Status Screen via `@mercadopago/sdk-react`, não o snippet JS puro da doc do MP.

**Import dinâmico:**

```ts
const StatusScreen = dynamic(
  () => import("@mercadopago/sdk-react").then((mod) => mod.StatusScreen),
  { ssr: false }
);
```

**Uso na tela de pagamento pendente (`/checkout/pay/[orderId]`):**

- Quando `status` é `pending` ou `in_process`, o front guarda:
  - `orderNumber`
  - `paymentMethodId`
  - `paymentId` (string, a partir de `payment_id` do backend)
  - `qrCodeBase64`, `qrCode`, `ticketUrl`, `externalResourceUrl` (quando existirem)
- A tela mostra:
  - **Acima:** QR Pix ou link do boleto + botões “Ver boleto / Ver instruções”.
  - **Abaixo:** componente `StatusScreen` com `initialization.paymentId = paymentId`.

Layout sugerido (já seguido na implementação):

- **Acima:** seus componentes (QR Pix, link de boleto, resumo da compra, botão “Voltar à loja”).
- **Abaixo:** container com o Status Screen Brick (no nosso caso, o próprio componente React `StatusScreen`).

### 6. Checklist rápido para o frontend

- [ ] Chamar `/api/orders/{order}/payment/preference` e usar `preference_id` + `public_key` no Payment Brick.
- [ ] No `onSubmit`, montar payload com:
  - [ ] `payment_method_id`, `payment_type`, `transaction_amount`, `installments`.
  - [ ] `payer.email`, `payer.first_name`, `payer.last_name`.
  - [ ] `payer.identification` (`type`, `number`).
  - [ ] `payer.address` completo para boleto.
  - [ ] `token` e `issuer_id` **apenas** quando `payment_type` indicar cartão.
- [ ] Enviar payload para `/api/orders/{order}/payment/process`.
- [ ] Usar a resposta do backend para:
  - [ ] Cartão: exibir sucesso/erro imediato.
  - [ ] Pix: exibir QR/código/link + instanciar Status Screen Brick com `payment_id`.
  - [ ] Boleto: exibir link do boleto (`external_resource_url`) + instanciar Status Screen Brick com `payment_id`.

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

### O que o BACKEND deve retornar em `POST /orders/:id/payment/process`

Resposta mínima: `{ "success": true, "payment_id": "...", "status": "...", "order_number": "..." }`.

Quando **status** for **pending** (PIX ou boleto), o backend deve incluir na resposta os dados que o MP devolve no pagamento criado, para o frontend exibir QR Code / link:

| Campo | Quando | Descrição |
|-------|--------|-----------|
| **qr_code_base64** | PIX, status pending | Imagem do QR em base64 (`point_of_interaction.transaction_data.qr_code_base64`). |
| **qr_code** | PIX, status pending | Código copia-e-cola (`point_of_interaction.transaction_data.qr_code`). |
| **ticket_url** | PIX ou boleto, status pending | URL da página do MP com instruções (`point_of_interaction.transaction_data.ticket_url` ou equivalente). |
| **external_resource_url** | Boleto, status pending | URL do boleto para o comprador pagar (`transaction_details.external_resource_url`). |

Exemplo de resposta para PIX pendente:

```json
{
  "success": true,
  "payment_id": "123456789",
  "status": "pending",
  "status_detail": "pending_waiting_transfer",
  "order_number": "12345",
  "qr_code_base64": "iVBORw0KGgo...",
  "qr_code": "00020126600014br.gov.bcb.pix...",
  "ticket_url": "https://www.mercadopago.com.br/payments/123456789/ticket?..."
}
```

Sem esses campos, o frontend não consegue mostrar a tela “Conclua seu pagamento com PIX” (QR + copiar código) e cai na tela genérica de sucesso.

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

## Proxy de CEP (boleto / ticket) — 401 na API do Mercado Libre

Ao pagar com **boleto** ou **ticket**, o Brick do Mercado Pago preenche endereço e, ao sair do campo de CEP, chama internamente:

```http
GET https://api.mercadolibre.com/countries/BR/zip_codes/{cep}
```

Essa API do Mercado Libre **exige** o header `Authorization: Bearer {ACCESS_TOKEN}`. No frontend só existe a **public key**, então a chamada sai sem token e o servidor responde **401 Unauthorized** ("authorization value not present").

### Solução: proxy no backend

O frontend intercepta essas chamadas e redireciona para o **backend**. O backend deve expor um endpoint que faz a requisição **autenticada** ao Mercado Libre e devolve a resposta.

**Endpoint que o backend deve implementar:**

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/api/mercadolibre/zip-codes/:country/:cep` | Proxy para `https://api.mercadolibre.com/countries/:country/zip_codes/:cep` |

**Exemplo:** `GET /api/mercadolibre/zip-codes/BR/17030590`

**O que o backend deve fazer:**

1. Receber `country` (ex.: `BR`) e `cep` (apenas dígitos, ex.: `17030590`).
2. Chamar `GET https://api.mercadolibre.com/countries/{country}/zip_codes/{cep}` com o header:
   ```http
   Authorization: Bearer {MERCADO_PAGO_ACCESS_TOKEN}
   ```
   Use o mesmo **Access Token** (credencial privada) que já existe para criar preferências/pagamentos no Mercado Pago.
3. Retornar o corpo da resposta do Mercado Libre com status HTTP equivalente (ex.: 200 e JSON, ou 404 se o CEP não existir).

**Frontend:** Na página de pagamento (`/checkout/pay/[orderId]`), o `fetch` é interceptado: quando a URL for `api.mercadolibre.com/countries/BR/zip_codes/{cep}`, a requisição é enviada para `{origin}/api-proxy/api/mercadolibre/zip-codes/BR/{cep}` (que o Next reescreve para o backend). Assim o Brick continua funcionando e o 401 deixa de ocorrer.

---

## Backend `process`: PIX e Boleto (token opcional, payload por método)

O frontend envia **sem `token`** quando o usuário escolhe PIX ou boleto. O backend precisa:

1. **Validação:** tornar `token` **opcional**; exigir `token` apenas quando `payment_method_id` for de cartão (visa, master, amex, naranja, etc.).
2. **Montar o payload do MP conforme o método:** cartão usa `token` + `installments` + `issuer_id`; PIX e boleto **não** devem enviar `token`.

### Regras por método

| Método   | payment_method_id | Token   | Campos extras no body para o MP |
|----------|--------------------|--------|----------------------------------|
| Cartão   | visa, master, etc. | Obrigatório | installments, issuer_id |
| PIX      | `pix`              | **Não enviar** | description, payer (email, first_name, identification). Não enviar installments ou usar 1. |
| Boleto   | `bolbradesco`      | **Não enviar** | description, payer (email, first_name, last_name, identification, **address**: zip_code, street_name, street_number, neighborhood, city, federal_unit). Opcional: date_of_expiration. |

O frontend já envia `payment_type` (ex.: `bank_transfer`, `ticket`) e `payer.address` quando o Brick preenche (boleto). Use `payment_type` ou `payment_method_id` para decidir o fluxo.

### Exemplo de validação (Laravel) — token condicional

```php
$validated = $request->validate([
    'token' => 'nullable|string',  // não required; só obrigatório para cartão
    'issuer_id' => 'nullable|string',
    'payment_method_id' => 'required|string',
    'transaction_amount' => 'required|numeric|min:0',
    'installments' => 'required|integer|min:1',
    'payer' => 'required|array',
    'payer.email' => 'required|email',
    'payer.first_name' => 'nullable|string',
    'payer.last_name' => 'nullable|string',
    'payer.identification' => 'nullable|array',
    'payer.identification.type' => 'nullable|string',
    'payer.identification.number' => 'nullable|string',
    'payer.address' => 'nullable|array',
    'payer.address.zip_code' => 'nullable|string',
    'payer.address.street_name' => 'nullable|string',
    'payer.address.street_number' => 'nullable|string',
    'payer.address.neighborhood' => 'nullable|string',
    'payer.address.city' => 'nullable|string',
    'payer.address.federal_unit' => 'nullable|string',
]);

$paymentMethodId = $validated['payment_method_id'];
$isCard = in_array(strtolower($paymentMethodId), ['visa', 'master', 'amex', 'naranja', 'debvisa', 'debmaster', 'elo', 'hipercard', 'cabal', 'maestro', 'debelo', 'debcabal'], true);

if ($isCard && empty(trim($validated['token'] ?? ''))) {
    return response()->json(['message' => 'Token is required for card payments.'], 422);
}
```

### Exemplo de montagem do payload para o MP (Laravel)

```php
$paymentData = [
    'transaction_amount' => (float) $validated['transaction_amount'],
    'description' => 'Order ' . $order->order_number,
    'payment_method_id' => $paymentMethodId,
    'payer' => [
        'email' => $validated['payer']['email'],
        'first_name' => $order->user->name ?? $validated['payer']['first_name'] ?? null,
        'identification' => [
            'type' => $validated['payer']['identification']['type'] ?? 'CPF',
            'number' => $order->user->document_number ?? $validated['payer']['identification']['number'] ?? null,
        ],
    ],
    'statement_descriptor' => 'PHARMA GREEN',
    'external_reference' => (string) $order->id,
];

if ($isCard) {
    $paymentData['token'] = $validated['token'];
    $paymentData['installments'] = (int) $validated['installments'];
    if (!empty($validated['issuer_id'])) {
        $paymentData['issuer_id'] = $validated['issuer_id'];
    }
} else {
    // PIX ou boleto: não enviar token
    $paymentData['installments'] = 1;
}

// Boleto: endereço obrigatório (exigência BACEN)
if (strtolower($paymentMethodId) === 'bolbradesco') {
    $paymentData['payer']['last_name'] = $validated['payer']['last_name'] ?? $order->user->name ?? null;
    if (!empty($validated['payer']['address'])) {
        $addr = $validated['payer']['address'];
        $paymentData['payer']['address'] = [
            'zip_code' => preg_replace('/\D/', '', $addr['zip_code'] ?? ''),
            'street_name' => $addr['street_name'] ?? '',
            'street_number' => $addr['street_number'] ?? '',
            'neighborhood' => $addr['neighborhood'] ?? '',
            'city' => $addr['city'] ?? '',
            'federal_unit' => $addr['federal_unit'] ?? '',
        ];
    }
}

$notificationUrl = $this->resolveNotificationUrl();
if ($notificationUrl !== null) {
    $paymentData['notification_url'] = $notificationUrl;
}
```

Assim o backend não envia `token` para PIX nem para boleto e envia o endereço completo no boleto.

---

## Erro "Collector user without key enabled for QR render" (PIX)

Quando a API do Mercado Pago retorna esse erro ao criar um pagamento com `payment_method_id: "pix"`, significa que a **conta coletora** (a conta dona do Access Token usado no backend) **não tem PIX habilitado para gerar QR**.

### O que fazer

1. **Conta em produção:** use **Access Token de produção** (não de teste), da mesma conta que recebe o dinheiro.
2. **Chave PIX na conta:** no [painel do Mercado Pago](https://www.mercadopago.com.br/) (conta do vendedor), cadastre e ative uma **chave PIX** no Banco Central. Sem chave PIX ativa, o MP não gera QR Code.
3. **Mesma conta:** o `public_key` retornado em `/payment/preference` e o Access Token usados devem ser da **mesma** conta (mesmo coletor).

Se estiver em **ambiente de teste**, alguns usuários de teste podem não ter PIX habilitado; nesse caso use um usuário de teste que tenha PIX ativo ou teste em produção com valores baixos.

Referência: [ajuda MP — erro collector user no key qr render](https://www.mercadopago.com.br/ajuda/erro-collector-user-no-key-qr-render_36544).

---

## Avaliar um pagamento específico (MCP)

Se você tiver um **payment_id** do Mercado Pago (de um pagamento que veio cancelado ou com problema), pode usar a ferramenta de avaliação de qualidade do MCP Mercado Pago com esse ID para ver o diagnóstico e recomendações. No Cursor, isso pode ser feito via MCP com o `payment_id` em questão.
