# MES Plastico — Contexto do Projeto e Guia para Agentes

> **DIRETRIZ OBRIGATÓRIA PARA AGENTES DE IA (QUALQUER MODELO):**
> Antes de implementar, modificar ou sugerir qualquer mudança neste repositório, LEIA ESTE DOCUMENTO INTEGRALMENTE.
> Todas as entregas devem seguir os padrões de arquitetura, design system, motion principles e esteira de qualidade aqui estipulados.

---

## 1. 📋 Visão Geral do Projeto

- **Projeto:** Sistema MES (Manufacturing Execution System) para Indústria de Embalagens Plásticas Flexíveis.
- **Pilar Tecnológico:** Aplicação Web PWA (Progressive Web App) rodando em arquitetura Local-First (Edge Computing) com Sincronização em Nuvem (Cloud Sync) e Inteligência Artificial Gerencial.
- **Ambiente Operacional:** Tablets Android de 10 polegadas fixados em braços articulados das máquinas industriais em modo Kiosk (tela cheia) e Navegadores Desktop/Mobile para o Portal Executivo.

---

## 2. 🏗️ Arquitetura de Rede Dual (Edge Local + Cloud Sync)

1. **Servidor Local (Edge Server - Chão de Fábrica):**
   - Mini PC / Edge Server na rede física local (PostgreSQL + Node.js/TypeScript).
   - Tablets conectam-se via Wi-Fi local sem dependência de internet externa (**0% dependência de internet para a operação da fábrica**).
2. **Cloud Sync Worker:**
   - Worker em background sincroniza dados acumulados com espelho na nuvem (Supabase / AWS).
3. **Portal Executivo:**
   - Acesso web externo seguro via autenticação com controle de níveis por perfil (Operador, Preparador, Supervisor, Dono).

---

## 3. 🎨 Design System Industrial & Motion Principles

### Padrão Universal de Cores Industriais (Andon Visual)
- 🟢 **Verde (`#22C55E`):** Produção Normal / Em Andamento
- 🟡 **Amarelo (`#EAB308`):** Setup / Regulação / Troca de Lote
- 🔴 **Vermelho (`#EF4444`):** Parada Não Planejada / Defeito / Manutenção
- 🔵 **Azul (`#3B82F6`):** Chamado de Suporte Ativo / Aguardando Atendimento
- **Superfícies Dark:** `bg-surface-900` (`#0F172A`), `bg-surface-800` (`#1E293B`), `bg-surface-700` (`#334155`)

### Diretrizes de UI/UX Industrial
- **Touch Targets Extra Grandes:** Área de toque mínima de **64x64px** para operação segura com luvas ou mãos com graxa.
- **Teclado Numérico Customizado Nativo (`NumericKeypad`):** NUNCA invocar o teclado padrão do sistema operacional em campos industriais. Usar o teclado pop-up virtual.
- **Regra dos 3 Cliques:** Nenhuma ação rotineira do operador deve exigir mais de 3 cliques.

### Motion Principles (Síntese Emil Kowalski / Jakub Krehel / Jhey Tompkins)
Referência: [design-principles](https://github.com/kylezantos/design-principles)
- **Restraint & Speed:** Transições ultra-rápidas (**< 300ms, idealmente ~180-200ms**).
- **Sem "Motion Slop":** Nada de animações lentas, pulsações gratuitas em todos os elementos ou transições que atrasem o operador.
- **Propriedades Otimizadas:** Animar exclusivamente `transform` (`translate`, `scale`) e `opacity`.
- **Skeleton Screens:** Uso obrigatório de `SkeletonCard`, `SkeletonTable` e `.skeleton-loader` com efeito shimmer durante carregamento.
- **Feedback Tátil/Visual:** `active:scale-95` em botões e estados de progresso em ações interativas.
- **Acessibilidade:** `prefers-reduced-motion` estritamente respeitado em todo o CSS.

---

## 4. 🚀 Governança de Código & Workflow GitHub

### Issues do Repositório
Todas as tarefas devem ser previamente mapeadas em Issues no GitHub categorizadas como:
- `nova-função`
- `melhoria`
- `correção`

### Pull Requests Obrigatórios
Nenhum código entra diretamente na branch `main`. Todo Pull Request deve:
1. Mencionar a Issue relacionada (`Closes #X`);
2. Explicar o que mudou detalhadamente;
3. Descrever como foi validado;
4. Registrar riscos, limitações e próximos passos;
5. Passar pela Esteira de Qualidade no GitHub Actions.

---

## 5. 🛡️ Esteira de Qualidade, Observabilidade & Arquitetura

### 1. Observabilidade
- Preparação para Sentry (captura de erros no client PWA), Datadog/New Relic (telemetria de Edge) e OpenTelemetry.

### 2. Qualidade e Lint de Código
- Tipagem TypeScript estrita (sem uso de `any` frouxo).
- Linting estruturado com Biome / Oxlint.
- Verificação de imports não utilizados e bundle boundaries.

### 3. Testes
- Testes unitários de helpers e cálculos de KPIs.
- Testes de integração de fluxo de Pista Dupla e liberação de Setup com PIN.
- Testes End-to-End com Playwright (modo Kiosk / tablet).

### 4. Segurança e Operação
- Rate limit nas chamadas de Edge Sync.
- Separação clara entre frontend PWA e backend Edge/Cloud.
- Isolamento de permissões por perfil (Operador não acessa telas de Supervisor nem Dashboard do Dono).

### 5. Princípios de Arquitetura
- **Evitar Overengineering:** Simplicidade de manutenção em ambiente de fábrica.
- **Componentizar desde o início:** Reutilizar primitivos de `src/components/ui/` e `src/components/industrial/`.
- **Impedir reconstrução de componentes existentes:** Consulte sempre `src/components/` antes de criar algo novo.
- **DRY com critério:** Evitar acoplamento prematuro entre setores que têm lógicas divergentes (ex: Corte vs. Extrusão).

---

## 6. 📁 Estrutura de Diretórios

```
plastico-mes/
├── .github/
│   ├── ISSUE_TEMPLATE/       # Templates de Nova Função, Melhoria e Correção
│   ├── workflows/            # Pipeline CI/CD de qualidade
│   └── PULL_REQUEST_TEMPLATE.md
├── docs/
│   └── CONTEXT.md            # Este guia
├── public/
│   ├── manifest.json         # Manifesto PWA
│   ├── sw.js                 # Service Worker (Local-First Cache)
│   └── favicon.svg           # Ícone do sistema
├── src/
│   ├── components/
│   │   ├── ui/               # Button, Card, Modal, Input, Badge, Toggle, ProgressBar, Table, Tabs
│   │   ├── industrial/       # NumericKeypad, AndonStatus, MachineCard, CounterDisplay
│   │   ├── layout/           # Header, Sidebar, PageContainer
│   │   └── feedback/         # Skeleton, Toast
│   ├── pages/
│   │   ├── auth/             # LoginPage (PIN)
│   │   ├── tablet/
│   │   │   ├── extrusion/    # ExtrusionPage (Filme, Zonas de Temperatura, Bobina Mãe)
│   │   │   ├── printing/     # PrintingPage (Pantone, Corona, Ancoragem, Refile)
│   │   │   └── cutting/      # CuttingPage (Pista Simples/Dupla, Contador 500un, 3x Inspeção)
│   │   ├── supervisor/       # SupervisorPage (Filtro Estrito por Setor, Kanban, Liberação Setup)
│   │   └── executive/        # ExecutivePage (3 Blocos Sequenciais, Balanço de Massa, IA Copilot)
│   ├── data/                 # mockData.ts
│   ├── hooks/                # useLocalStorage, useElapsedTime
│   ├── types/                # index.ts (Definições TypeScript)
│   ├── utils/                # helpers.ts (Cálculos de rendimento, formatações pt-BR)
│   ├── App.tsx               # Roteamento e Lazy Loading com Suspense
│   ├── index.css             # Tailwind v4, temas e animações
│   └── main.tsx              # Ponto de entrada
└── vite.config.ts
```
