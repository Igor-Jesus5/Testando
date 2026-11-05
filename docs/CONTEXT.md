# MES Plastico — Contexto do Projeto

## 📋 Visão Geral

**Projeto:** Sistema MES (Manufacturing Execution System) para Indústria de Embalagens Plásticas Flexíveis.

**Pilar Tecnológico:** Aplicação Web PWA (Progressive Web App) com arquitetura Local-First e capacidade de sincronização em nuvem.

**Stack Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4

---

## 🏗️ Arquitetura

### Módulos do Sistema

1. **Tablet de Máquina** — Interfaces por setor (Extrusão, Impressão, Corte e Solda)
2. **Painel do Supervisor** — Organizado por setor com Andon e Kanban
3. **Dashboard Executivo** — KPIs globais + Copiloto IA
4. **Autenticação** — Login por PIN numérico com níveis de permissão

### Perfis de Acesso

| Perfil | Acesso | Login |
|--------|--------|-------|
| Operador | Tablet da sua máquina | PIN 4 dígitos |
| Preparador | Tablet + Setup release | PIN 4 dígitos |
| Supervisor | Painel Supervisor completo | PIN 4 dígitos |
| Dono/Gestor | Dashboard Executivo + IA | PIN 4 dígitos |

---

## 🎨 Design System

### Cores Andon (Padrão Industrial Universal)

| Status | Cor | Hex | Uso |
|--------|-----|-----|-----|
| 🟢 Produzindo | Verde | `#22C55E` | Produção normal |
| 🟡 Setup | Amarelo | `#EAB308` | Regulação / Troca |
| 🔴 Parada | Vermelho | `#EF4444` | Defeito / Manutenção |
| 🔵 Chamado | Azul | `#3B82F6` | Suporte ativo |

### Diretrizes UI/UX Industrial

- **Touch targets:** mínimo 64×64px (operação com luvas)
- **Teclado numérico:** customizado, sem teclado do SO
- **Regra dos 3 cliques:** nenhuma ação rotineira exige navegação profunda
- **Tipografia:** Inter (400/500/600/700/800)
- **Tema:** Dark (bg #0F172A)

### Motion Principles (Emil Kowalski — Restraint & Speed)

- Transições < 300ms, idealmente ~180ms
- `transition-all duration-200 ease-out` como padrão
- Animações apenas funcionais — sem gratuitidade
- `active:scale-95` para feedback de botão
- Skeleton screens com shimmer para carregamento
- `prefers-reduced-motion` respeitado em todos os componentes

---

## 🔧 Padrões de Desenvolvimento

### Workflow GitHub

1. **Issues** categorizadas como: `nova-função`, `melhoria`, `correção`
2. **Pull Requests** obrigatórios com:
   - Issue relacionada mencionada
   - Descrição do que mudou
   - Como foi validado
   - Riscos, limitações e próximos passos
3. **Branch principal** (`main`) protegida — código entra via PR

### Qualidade de Código

- **Linting:** Biome (quando configurado)
- **Testes:** Vitest (unit) + Playwright (e2e)
- **Lazy loading:** React.lazy + Suspense por rota
- **Code splitting:** chunks separados (react-vendor, router, charts)
- **Componentização:** DRY sem abstrações prematuras

### Princípios de Arquitetura

- ❌ Evitar overengineering
- ❌ Evitar bottlenecks absurdos
- ✅ Componentizar desde o início
- ✅ Aplicar DRY com critério
- ✅ Não reconstruir componentes existentes
- ✅ Performance budget respeitado

---

## 📁 Estrutura de Pastas

```
src/
├── components/
│   ├── ui/          → Primitivos (Button, Card, Modal, Input, Badge, Toggle, Table, Tabs, ProgressBar)
│   ├── industrial/  → Componentes industriais (NumericKeypad, AndonStatus, MachineCard, CounterDisplay)
│   ├── layout/      → Layout (Sidebar, Header, PageContainer)
│   └── feedback/    → Feedback (Skeleton, Toast)
├── pages/
│   ├── auth/        → LoginPage (PIN)
│   ├── tablet/
│   │   ├── extrusion/  → ExtrusionPage
│   │   ├── printing/   → PrintingPage
│   │   └── cutting/    → CuttingPage
│   ├── supervisor/     → SupervisorPage
│   └── executive/      → ExecutivePage
├── hooks/           → Custom hooks (useLocalStorage, useElapsedTime)
├── store/           → State management
├── data/            → Mock data
├── utils/           → Helpers
└── types/           → TypeScript types
```

---

## 📊 Módulos Detalhados

### Setor 1: Extrusão
- Ficha técnica com formulações (PEBD, PEAD, Linear, Pigmento, EVA)
- Temperaturas das zonas do canhão (Z1-Z5)
- Rastreabilidade de matéria-prima (lote)
- "Concluir Bobina Mãe" com peso bruto e QR Code

### Setor 2: Impressão / Rebobinadeira
- QR Code da bobina da extrusão
- Validação Pantone + Corona (38-42 dynas) + Ancoragem
- Apontamento de aparas (Kg)

### Setor 3: Corte e Solda
- Pista Simples / Dupla (toggle com 2 cards independentes)
- Contador de pacotes/fardos (500 un por pacote)
- Checklist de qualidade 3x por bobina (Início/Meio/Fim)
- Apontamento de refugo com motivo
- Chamados Andon rápidos

### Painel Supervisor
- Seletor de setor (Extrusão | Impressão | Corte e Solda)
- Cards de status filtrados por setor
- Central Andon com tempo decorrido
- Fila Kanban de OPs
- Liberação de Setup com PIN

### Dashboard Executivo
- KPIs globais (produção, eficiência, refugo)
- Visão do galpão em 3 blocos
- Tabela de produtividade por turno
- Balanço de massa
- Copiloto IA (chat com histórico)

---

## 🚀 Próximos Passos (Backend — Futuro)

- Node.js/TypeScript backend com PostgreSQL
- Servidor local (Edge) + Sincronização em nuvem
- Autenticação JWT/OAuth2
- WebSocket para dados em tempo real
- API RESTful para o Copiloto IA

---

> **INSTRUÇÃO PARA AGENTES:** Antes de implementar qualquer mudança neste projeto, leia este arquivo por completo. Siga os padrões de design, cores Andon, motion principles e workflow GitHub descritos acima. Não crie componentes que já existem. Utilize mock data para demonstração.
