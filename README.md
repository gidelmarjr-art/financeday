# FinanceDay

Painel de câmbio global em tempo real com leitura analítica por IA — projeto
de portfólio construído em React (Vite), com uma landing page de marketing e
um dashboard funcional.

O elemento visual de assinatura é um **painel split-flap** (os dígitos que
"viram", como em painéis mecânicos de câmbio de aeroporto), usado tanto no
hero da landing page quanto no painel principal do dashboard.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Estrutura de pastas

```
financeday/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx              # ponto de entrada
│   ├── App.jsx                # rotas (React Router)
│   ├── styles/
│   │   ├── tokens.css          # cores, fontes, espaçamento — design tokens
│   │   └── global.css          # reset + utilitários compartilhados (.btn, .reveal…)
│   ├── data/
│   │   └── mock.js             # dados ilustrativos (moedas, histórico, insights)
│   ├── services/
│   │   ├── exchangeService.js  # integração real com a Frankfurter API
│   │   └── aiService.js        # stub — pronto para plugar um provedor de IA
│   ├── hooks/
│   │   ├── useExchangeRates.js # busca + polling das cotações, com limpeza no unmount
│   │   ├── useInView.js        # IntersectionObserver p/ animações de scroll
│   │   └── useCountUp.js       # contagem animada (usado nas estatísticas)
│   ├── layouts/
│   │   ├── PublicLayout.jsx    # navbar + rodapé (landing e sobre)
│   │   └── DashboardLayout.jsx # sidebar + barra superior (dashboard)
│   ├── pages/
│   │   ├── Home.jsx            # landing page — compõe as seções abaixo
│   │   ├── Dashboard.jsx       # dashboard — liga os dados ao hook em tempo real
│   │   └── About.jsx           # sobre o projeto
│   └── components/
│       ├── common/
│       │   └── Reveal.jsx      # wrapper de animação de entrada ao rolar
│       ├── layout/              # Navbar, Footer, Sidebar
│       ├── landing/             # Hero, TickerMarquee, Capabilities,
│       │                        # ProductShowcase, StatsSection, CtaBanner
│       └── dashboard/           # FlapBoard, CurrencyCard, CurrencyChart, AiInsights
├── index.html
├── package.json
└── vite.config.js
```

Cada componente fica em seu próprio arquivo com o CSS correspondente ao lado
(`Hero.jsx` + `Hero.css`, por exemplo) — sem estilo inline, exceto valores que
só existem em tempo de execução (como o dígito exibido a cada instante no
painel split-flap).

## Rotas

| Rota | Página | Layout |
|---|---|---|
| `/` | Landing page | `PublicLayout` (navbar + rodapé) |
| `/sobre` | Sobre o projeto | `PublicLayout` |
| `/dashboard` | Painel de câmbio | `DashboardLayout` (sidebar + topo) |

## Design

- **Identidade**: inspirada em painéis mecânicos de câmbio — o hairline no
  meio de cada `FlapTile` (a "linha de emenda") reaparece como divisor nas
  linhas da seção de capacidades, dando uma costura visual entre as páginas.
- **Paleta**: azul-tinta profundo (`--color-bg`) + dourado (`--color-gold`),
  com verde/coral só para indicar alta/queda.
- **Tipografia**: Space Grotesk (títulos), IBM Plex Mono (todo número/dado),
  Inter (corpo de texto).
- **Animação com propósito**, três ideias, não uma por seção:
  1. dígitos se resolvendo (hero + estatísticas) — a mesma ideia, duas vezes;
  2. ticker com rolagem contínua — atmosfera, como um painel real nunca para;
  3. revelação suave ao rolar (`Reveal`) — estrutural, aplicada igual em
     todas as seções, sem variar o efeito a cada bloco.

## Dados

- **24 moedas** no painel — as majors de sempre + as 20 moedas mais
  valorizadas do mundo segundo o ranking da
  [Mitrade](https://www.mitrade.com/pt/insights/forex/basicos-de-forex/moedas-mais-valorizadas-e-caras),
  do dinar kuwaitiano ao bitcoin.
- Câmbio real via [Frankfurter API](https://frankfurter.dev) (referência do
  BCE) para **14 delas**: USD, EUR, GBP, CHF, JPY, CNY, CAD, SGD, AUD, NZD,
  ILS, NOK, MXN e TRY. Se a chamada falhar, o dashboard cai para os dados de
  `data/mock.js` e avisa no topo do painel.
- As outras 10 continuam ilustrativas — o BCE não publica referência para
  moedas atreladas/regionais como as do Golfo (KWD, BHD, OMR, SAR, AED,
  JOD), Gibraltar (GIP) e Ilhas Cayman (KYD), nem para ARS ou bitcoin.
- **Clique em qualquer moeda da grade** e o gráfico abaixo mostra o
  histórico dela — não só os 4 atalhos rápidos (`QUICK_PICKS`, em
  `Dashboard.jsx`). Para as 4 moedas mais acompanhadas a série é "curada";
  para as outras 20, é gerada a partir do valor atual e da variação do dia
  (`getHistoryForCode` em `data/mock.js`), com uma semente fixa por moeda —
  então a série não muda a cada clique.
- Os textos de IA também são mock por enquanto.

## Próximos passos

- Ligar `aiService.js` a um provedor de IA real (via backend próprio — nunca
  chamando uma API de IA com chave exposta direto do frontend).
- Buscar histórico real para as 14 moedas cobertas pela Frankfurter (hoje é
  uma série gerada, não um dado histórico de verdade).
- Encontrar uma fonte de dados para as moedas do Golfo, Gibraltar, Cayman,
  ARS e bitcoin.
