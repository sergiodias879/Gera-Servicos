# CleanPro - Project TODO

## Phase 1: Branding & Setup
- [x] Logo customizado gerado com design profissional
- [x] Cores atualizadas (Azul #0066CC, Verde #00B050, Laranja #FF9500)
- [x] app.config.ts atualizado com nome, slug e ícones
- [x] Tema de cores configurado em constants/theme.ts com dark mode
- [x] design.md criado com especificações de interface
- [x] todo.md criado com lista de funcionalidades

## Phase 2: Base Components
- [x] Button component (primary, secondary, tertiary)
- [x] Card component com suporte a shadow e border
- [x] Badge component (filled, outlined, tamanhos)
- [x] StatCard component com ícone, valor e trend
- [x] ThemedText component para tipografia consistente
- [x] ScreenContainer component para safe area

## Phase 3: Navigation Structure
- [x] Tab bar navigation com 5 abas (Dashboard, Ordens, Agenda, Clientes, Mais)
- [x] Icon mapping para todos os ícones das abas
- [x] Navegação entre telas funcionando
- [ ] Deep linking configurado

## Phase 4: Dashboard Screen
- [x] Layout com grid de stat cards (2 colunas)
- [x] Indicadores: Serviços Hoje, Faturamento, Clientes Ativos, Taxa Conclusão
- [ ] Gráfico de tendências (últimos 7 dias)
- [x] Lista de ordens recentes
- [ ] Pull-to-refresh funcionando

## Phase 5: Ordens Screen
- [x] Lista de ordens com FlatList
- [x] Card de ordem com status visual
- [x] Barra de busca e filtros
- [x] Botão para criar nova ordem
- [ ] Tela de detalhes de ordem
- [x] Modal para criar/editar ordem

## Phase 6: Ordem Detail Screen
- [ ] Exibição de informações completas
- [ ] Checklist interativo
- [ ] Upload de fotos (até 10)
- [ ] Mudança de status
- [ ] Salvar alterações

## Phase 7: Agenda Screen
- [ ] Calendário mensal interativo
- [ ] Indicadores de serviços por data
- [x] Lista de eventos do dia selecionado
- [x] Modal para agendar novo serviço
- [ ] Sincronização com ordens

## Phase 8: Clientes Screen
- [x] Lista de clientes com FlatList
- [x] Barra de busca em tempo real
- [x] Card de cliente com informações resumidas
- [ ] Tela de detalhes do cliente
- [ ] Histórico de serviços do cliente
- [x] Modal para adicionar/editar cliente

## Phase 9: Mais Screen
- [x] Menu de opções (Perfil, Configurações, Relatórios, Logout)
- [x] Tela de perfil do usuário (exibindo dados do usuário autenticado)
- [x] Tela de configurações (tema dark/light mode)
- [ ] Tela de relatórios
- [x] Logout funcionando

## Phase 10: Database & Models
- [x] Schema Drizzle para tabelas (users, clients, orders, schedules)
- [x] Migrations criadas e executadas no InfinityFree
- [x] Relacionamentos entre tabelas
- [x] Índices para performance

## Phase 11: API & Server
- [x] TRPC endpoints para CRUD de ordens
- [x] TRPC endpoints para CRUD de clientes
- [x] TRPC endpoints para CRUD de agendamentos
- [ ] TRPC endpoints para dashboard (indicadores)
- [x] Autenticação com Manus OAuth (já configurada)
- [x] Validação de dados (Zod schemas)

## Phase 12: Local Storage & Sync
- [ ] AsyncStorage para cache local
- [x] Sincronização de dados com servidor (TanStack Query)
- [ ] Offline mode básico
- [ ] Conflito resolution

## Phase 13: Media & Files
- [ ] Upload de fotos para S3
- [ ] Compressão de imagens
- [ ] Galeria de fotos em ordem
- [ ] Visualizador de imagens

## Phase 14: Testing & Polish
- [ ] Testes unitários para componentes
- [ ] Testes de integração para fluxos
- [ ] Verificação de performance
- [ ] Ajustes de UI/UX
- [ ] Verificação de acessibilidade

## Phase 15: Delivery
- [x] Checkpoint final criado
- [x] Documentação atualizada
- [x] QR code para preview no Expo Go
- [x] Projeto entregue ao usuário com banco de dados integrado
