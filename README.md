# 📊 FinanceDay | Câmbio + Inteligência Artificial

> Plataforma inteligente de acompanhamento e análise de câmbio, combinando cotações em tempo real com resumos gerados por inteligência artificial para explicar o mercado de forma simples.
> 
---

## 🚀 Sobre o Projeto
Esta aplicação web foi criada com o objetivo de monitorar as principais moedas em relação ao real brasileiro (BRL). O sistema vai além de simples cotações, atuando como um analista que resume o que mudou e o porquê das variações em linguagem clara, integrando dados financeiros dinâmicos com um painel interativo.

- **Deploy Online:** [Acessar Projeto na Vercel](https://financeday.vercel.app/)

---

## ✨ Funcionalidades
- **Design Responsivo:** Adaptado com fluidez para diferentes tamanhos de tela (desktop, tablets e smartphones).
- **Interface Financeira Moderna:** Estilo dark mode sofisticado com cartões de cotação e ticker inferior em tempo real para ativos globais.
- **Seções Estruturadas:** 
  - *Início* com apresentação da proposta de valor e cotações de referência (USD, EUR, GBP, BTC).
  - *Dashboard* interativo para acompanhamento detalhado dos dados.
  - *Sobre* a tecnologia e capacidades da plataforma baseada em IA.

---

## 🛠️ Tecnologias Utilizadas
- **React** (com Framework moderno)
- **CSS Modules / Tailwind CSS** (ou estilização componentizada)
- **Vercel** (Hospedagem e CI/CD)

---

## 📊 Dados

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

---

## 💡 Status do Projeto
- **Status:** Concluído / Em melhorias contínuas.
