<div align="center">

# 🌱 Ceres Garden Manager

**Um gerenciador de horta fullstack construído com Next.js, Express e Prisma — focado em responder uma pergunta todo dia: "o que minha horta precisa de mim hoje?"**

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?style=flat-square&logo=typescript)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=reactquery)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=flat-square&logo=vitest)

[Demo ao vivo](https://ceres-garden-manager.vercel.app/login) · [Reportar Bug](../../issues) · [Solicitar Feature](../../issues)

</div>

---

## Índice
- [🌱 Ceres Garden Manager](#-ceres-garden-manager)
  - [Índice](#índice)
  - [📸 Screenshots](#-screenshots)
  - [✨ Features](#-features)
  - [🎨 Design \& Prototipagem](#-design--prototipagem)
  - [🏗️ Arquitetura \& Decisões Técnicas](#️-arquitetura--decisões-técnicas)
    - [Estrutura do projeto](#estrutura-do-projeto)
    - [⚙️ Backend](#️-backend)
      - [**Autenticação com refresh token em cookie `httpOnly`, com rotação**](#autenticação-com-refresh-token-em-cookie-httponly-com-rotação)
      - [**Posse verificada em cadeia, incluindo indireta**](#posse-verificada-em-cadeia-incluindo-indireta)
      - [**Bug de fuso horário no cálculo do "Hoje"**](#bug-de-fuso-horário-no-cálculo-do-hoje)
      - [**Middleware de erro centralizado**](#middleware-de-erro-centralizado)
    - [🖥️ Frontend](#️-frontend)
      - [**Deduplicação de refresh concorrente (single-flight)**](#deduplicação-de-refresh-concorrente-single-flight)
      - [**Proxy via `rewrites` para manter o cookie first-party**](#proxy-via-rewrites-para-manter-o-cookie-first-party)
      - [**Scroll infinito com Intersection Observer**](#scroll-infinito-com-intersection-observer)
      - [**Cache otimista sem envelope vazado**](#cache-otimista-sem-envelope-vazado)
  - [🧪 Testes](#-testes)
  - [🚀 Rodando Localmente](#-rodando-localmente)
  - [🛠️ Tecnologias](#️-tecnologias)
  - [🌐 Deploy](#-deploy)
  - [📄 Licença](#-licença)


---

## 📸 Screenshots

<img src="./docs/screenshots/Today-Desktop.webp" width="700" alt="Tela Hoje"/><br/>
**Today**: identifica os cuidados pendentes para cada plantio.<br/>
<img src="./docs/screenshots/BedDetail-Desktop.webp" width="700" alt="Detalhe do Canteiro"/><br/>
**Beds**: permite organizar os espaços físicos da horta.<br/>
<img src="./docs/screenshots/PlantingDetail-Mobile.webp" width="350" alt="Detalhe do Plantio Mobile"/><br/>
**Planting**: acompanha o desenvolvimento e os registros de cada cultivo.<br/>
<img src="./docs/screenshots/Login-Mobile.webp" width="350" alt="Tela de Login Mobile"/><br/>
**Login**: permite acesso aos registros atrelados ao seu email.<br/>

---

## ✨ Features

| Feature | Descrição |
|---|---|
| 🔐 **Autenticação JWT** | Access + refresh token, com rotação a cada refresh e refresh token protegido em cookie `httpOnly` |
| 📅 **Tela "Hoje"** | Coração do produto — lista os plantios com rega, adubo ou colheita pendente, calculado dinamicamente a partir do último registro (não de um cronograma fixo) |
| 🪴 **Canteiros e plantios** | CRUD completo, com posse verificada em cadeia (`CareLog → Planting → Bed → User`) |
| 📊 **Resumo agregado** | Total colhido, vezes regado/adubado por plantio, calculado sob demanda via `groupBy` |
| 📜 **Histórico com scroll infinito** | Log de cuidados paginado no back, consumido via `useInfiniteQuery` + Intersection Observer no front |
| ♻️ **Cache otimista** | Ações na tela "Hoje" atualizam a UI imediatamente, sem esperar um novo fetch |
| 🧪 **Testes automatizados** | Suíte unitária (lógica de domínio pura) + integração (fluxo HTTP completo contra banco de teste isolado) |

---

## 🎨 Design & Prototipagem

As telas foram planejadas antes da implementação: requisitos por página definidos na etapa de planejamento, e wireframes de baixa fidelidade esboçados no [Excalidraw](https://excalidraw.com) — evitando o custo de aprender uma ferramenta de design completa para um projeto onde a decisão estrutural (quais telas, o que cada uma mostra) já importava mais do que a decisão visual.

---

## 🏗️ Arquitetura & Decisões Técnicas

### Estrutura do projeto

```
ceres-garden-manager/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── modules/       # um módulo por domínio: auth, beds, plantings, care-logs, today
│   │       ├── tests/         # unit/ (funções puras) e integration/ (fluxo HTTP + banco de teste)
│   │       ├── errors.ts
│   │       ├── env.ts         # valida variáveis de ambiente na inicialização
│   │       └── app.ts
│   └── web/
│       └── src/
│           ├── app/            # rotas do App Router — (auth) e (app), separadas por layout
│           ├── hooks/          # um hook por recurso/mutation (TanStack Query)
│           ├── components/     # agrupados por domínio
│           └── lib/apiClient.ts
```

---

### ⚙️ Backend

#### **Autenticação com refresh token em cookie `httpOnly`, com rotação**

O refresh token nunca é exposto no corpo da resposta nem acessível por JavaScript — vive em um cookie `httpOnly`, setado pelo back e enviado automaticamente pelo navegador. A cada uso, o token atual é revogado e um novo é emitido:

```ts
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

#### **Posse verificada em cadeia, incluindo indireta**

`Planting` não guarda `userId` diretamente — a posse é herdada de `Bed`. Toda leitura/escrita filtra pela relação completa numa query só:

```ts
await prisma.planting.update({
  where: { id: plantingId, bed: { userId } },
  data,
});
```

Esse padrão também expôs uma falha real de IDOR no `logout`: um access token válido provava *quem* fazia a chamada, mas não que o refresh token enviado no cookie pertencia a esse mesmo usuário. Corrigido comparando `storedRefresh.userId` com `req.userId` antes de qualquer ação, tratando token de outro usuário como se não existisse — mesma resposta de "token inválido", para não vazar informação sobre existência.

#### **Bug de fuso horário no cálculo do "Hoje"**

Comparações de data usando getters locais (`getDate()`, `new Date(y, m, d)`) sobre timestamps salvos em UTC deslocavam silenciosamente a "próxima ação esperada" de um plantio em um dia inteiro, em qualquer fuso negativo. Corrigido extraindo e reconstruindo a data inteiramente em UTC:

```ts
export function toDateOnly(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}
```

> O teste foi escrito com `TZ` fixado propositalmente em um fuso negativo (`America/Sao_Paulo`) e validado por sabotagem: a implementação antiga foi restaurada temporariamente para confirmar que o teste falhava contra ela, antes de considerá-lo confiável.

#### **Middleware de erro centralizado**

Todo `try/catch` repetido em cada controller foi substituído por um único `errorHandler`, apoiado no fato de que o Express 5 encaminha automaticamente exceções lançadas dentro de handlers `async` para o middleware de erro — sem precisar de wrapper manual, como seria necessário no Express 4.

```ts
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next(err);
  if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") return res.status(404).json({ error: `${err.meta?.modelName} not found.` });
    if (err.code === "P2002") return res.status(409).json({ error: "..." }); // trecho simplificado
  }
  res.status(500).json({ error: "Internal server error." });
}
```

---

### 🖥️ Frontend

#### **Deduplicação de refresh concorrente (single-flight)**

Requisições simultâneas expirando ao mesmo tempo disparavam, cada uma, sua própria chamada a `/auth/refresh`. Como o refresh token rotaciona a cada uso, a primeira chamada revogava o token que as outras ainda tentavam usar — gerando deslogamentos intermitentes e difíceis de reproduzir (diagnosticado comparando logs de rede entre chamadas concorrentes). Resolvido compartilhando uma única Promise em andamento entre todas as chamadas concorrentes, em vez de cada uma disparar a sua:

```ts
let refreshTokenPromise: Promise<string> | null = null;

function getRefreshTokenDeduplicated() {
  if (refreshTokenPromise) return refreshTokenPromise;
  refreshTokenPromise = performRefresh().finally(() => {
    refreshTokenPromise = null;
  });
  return refreshTokenPromise;
}
```

#### **Proxy via `rewrites` para manter o cookie first-party**

Em produção, front (Vercel) e API (Render) ficam em domínios diferentes, ou seja, cross-site. Nesse cenário um cookie `sameSite: "strict"` não é enviado, e `sameSite: "none"` depende de cookies de terceiros, restritos em Safari e Firefox. Em vez de afrouxar o cookie, o front faz proxy de `/api/*` para o back via `rewrites` do Next: o navegador só conversa com o domínio da Vercel, o refresh token segue `HttpOnly; Secure; SameSite=Strict`, e o CORS deixou de ser necessário.

```ts
async rewrites() {
  return [{ source: "/api/:path*", destination: `${API_URL}/:path*` }];
}
```

#### **Scroll infinito com Intersection Observer**

O histórico de cuidados usa `useInfiniteQuery` no front, consumindo a paginação por offset que o back já expõe. O carregamento da próxima página é disparado observando a interseção do último card renderizado com a viewport, sem listener de scroll bruto:

```ts
const lastCareLogRef = useCallback(
  (node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      },
      { threshold: 0.1, rootMargin: "200px" },
    );

    if (node) observer.current.observe(node);
  },
  [isFetchingNextPage, hasNextPage, fetchNextPage],
);
```

O `ref` é reatribuído ao último item da lista a cada render (via callback ref, não `useRef` estático), então o observer sempre aponta para o elemento correto conforme novas páginas chegam.

#### **Cache otimista sem envelope vazado**
 
Mutations de `CareLog` editam diretamente o cache de `["today"]` no `onSuccess`, em vez de esperar um refetch — removendo a ação recém-concluída de `pendingActions` na hora. Isso expôs uma armadilha real: o cache guarda o envelope bruto da resposta (`{ todayOverview: [...] }`), não a lista já "desembrulhada" — uma primeira tentativa de `setQueryData` tratou o cache como array direto e quebrou silenciosamente dentro do callback, fazendo o TanStack Query reportar a mutation inteira como erro mesmo com a chamada de rede já confirmada com sucesso.
 
```ts
queryClient.setQueryData(["today"], (old: { todayOverview: Planting[] } | undefined) => {
  if (!old) return old;
  return {
    todayOverview: old.todayOverview.map((p) =>
      p.id === careLog.plantingId
        ? { ...p, pendingActions: p.pendingActions.filter((a) => a !== careLog.type) }
        : p,
    ),
  };
});
```

---

## 🧪 Testes

A cadeia de funções puras por trás do "Hoje" (`calculateNextCareDate → getLastCareDate → isCarePending → isHarvestReady → getPendingActions`) é coberta por testes unitários, com `vi.setSystemTime` para congelar "agora" e casos de borda montados de propósito — por exemplo, o item mais recente posicionado no meio de um array desordenado, não no fim, especificamente para invalidar uma implementação que apenas pegasse o último item da lista.

Um teste de integração cobre o fluxo completo (registro → login → criação → `GET /today`) contra um banco de teste isolado, migrado à parte do banco de desenvolvimento, com limpeza de tabelas entre execuções.

```bash
npm test                    # testes unitários
npm run test:integration    # testes de integração (requer banco de teste no ar)
```

---

## 🚀 Rodando Localmente

**Pré-requisitos:** Node.js 22+, Docker

```bash 
git clone https://github.com/Drey-1/ceres-garden-manager
cd ceres-garden-manager

# Backend
cd apps/api
npm install
cp .env.example .env
# Configure o seu arquivo .env com o seguinte padrão (substitua os valores conforme necessário):
# DATABASE_URL="postgresql://postgres:sua_senha@localhost:5433/garden_dev?schema=public"
# DATABASE_USER=postgres
# DATABASE_PASSWORD=sua_senha
# JWT_ACCESS_SECRET=seu_access_secret_super_seguro
# JWT_REFRESH_SECRET=seu_refresh_secret_super_seguro
# JWT_ACCESS_EXPIRES_IN=15m
# JWT_REFRESH_EXPIRES_IN=7d
# PORT=3001
docker compose up -d
npx prisma migrate deploy
npx prisma generate
npm run dev

# Frontend (em outro terminal)
cd apps/web
npm install
cp .env.example .env.local
# API_URL=http://localhost:3001
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Papel |
|---|---|---|
| [Next.js](https://nextjs.org) | 16 (App Router) | Frontend, roteamento |
| [TypeScript](https://typescriptlang.org) | 7 | Tipagem estática (front e back) |
| [TanStack Query](https://tanstack.com/query) | v5 | Server state, cache, mutations otimistas |
| [Tailwind CSS](https://tailwindcss.com) | v4 | Estilização utility-first |
| [Express](https://expressjs.com) | 5 | API REST |
| [Prisma](https://prisma.io) | 6 | ORM |
| [PostgreSQL](https://postgresql.org) | 16 | Banco de dados (Dockerized) |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | — | Access/refresh tokens |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | — | Hash de senha |
| [Vitest](https://vitest.dev) | v4 | Testes unitários |
| [Supertest](https://github.com/ladjs/supertest) | — | Testes de integração HTTP |
| [Biome](https://biomejs.dev) | — | Linter e formatter |

---

## 🌐 Deploy

| Camada | Plataforma |
|---|---|
| Frontend | Vercel |
| API | Render (free) |
| Banco | Neon (Postgres) |

> A API roda no plano gratuito do Render, que hiberna após alguns minutos de inatividade. O primeiro acesso depois de uma pausa pode levar cerca de um minuto.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](./LICENSE) para mais informações.

---

<div align="center">
  Feito com 🌱 e TypeScript
</div>