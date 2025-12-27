# CleanPro - Design System & Interface Specifications

## Overview

CleanPro é um aplicativo móvel de gestão de serviços de limpeza, projetado para facilitar o gerenciamento de ordens de serviço, agendamentos, clientes e financeiro. O design segue os padrões de interface do iOS (Apple Human Interface Guidelines) com suporte a dark mode.

## Screen List

A estrutura de navegação é baseada em 5 abas principais acessíveis via tab bar na parte inferior:

1. **Dashboard** - Visão geral com indicadores de performance
2. **Ordens** - Gestão de ordens de serviço com checklists e fotos
3. **Agenda** - Calendário e agendamento de serviços
4. **Clientes** - Lista e detalhes de clientes
5. **Mais** - Configurações, perfil e outras opções

### Telas Detalhadas

#### Dashboard
- **Conteúdo Principal**: Cards com indicadores (serviços hoje, faturamento, clientes ativos, taxa de conclusão)
- **Funcionalidades**: Visualização de tendências, filtros por período, acesso rápido a ordens pendentes
- **Layout**: Grid de 2 colunas para stat cards, seguido por lista de ordens recentes

#### Ordens
- **Conteúdo Principal**: Lista de ordens com status, cliente, data e valor
- **Funcionalidades**: Criar nova ordem, editar, visualizar detalhes, adicionar checklist e fotos
- **Layout**: FlatList com cards de ordem, pull-to-refresh, filtros por status

#### Agenda
- **Conteúdo Principal**: Calendário mensal com indicadores de serviços agendados
- **Funcionalidades**: Visualizar serviços por data, criar agendamento, editar horários
- **Layout**: Calendário interativo com lista de eventos abaixo

#### Clientes
- **Conteúdo Principal**: Lista de clientes com nome, telefone e último serviço
- **Funcionalidades**: Adicionar cliente, editar, visualizar histórico de serviços
- **Layout**: FlatList com barra de busca no topo

#### Mais
- **Conteúdo Principal**: Menu com opções de configurações, perfil, relatórios e logout
- **Funcionalidades**: Editar perfil, alterar tema, gerar relatórios, sincronizar dados
- **Layout**: Menu vertical com ícones e rótulos

## Primary Content and Functionality

### Dashboard
- **Stat Cards**: Serviços Hoje, Faturamento, Clientes Ativos, Taxa de Conclusão
- **Tendências**: Gráfico de serviços completados nos últimos 7 dias
- **Ordens Recentes**: Lista com 5 últimas ordens e seus status

### Ordens de Serviço
- **Campos**: Cliente, Data, Hora, Endereço, Descrição, Valor, Status
- **Checklist**: Itens de verificação customizáveis
- **Fotos**: Upload de até 10 fotos por ordem
- **Status**: Pendente, Em Progresso, Concluída, Cancelada

### Agenda
- **Visualização**: Mensal, semanal e diária
- **Eventos**: Exibição de serviços agendados com cores por status
- **Criação**: Modal para agendar novo serviço

### Clientes
- **Informações**: Nome, Telefone, Email, Endereço, CPF/CNPJ
- **Histórico**: Lista de serviços realizados
- **Contato**: Botões para ligar ou enviar mensagem

### Mais
- **Perfil**: Editar dados do usuário, foto de perfil
- **Configurações**: Tema (claro/escuro), notificações, idioma
- **Relatórios**: Exportar dados de serviços e faturamento
- **Logout**: Encerrar sessão

## Key User Flows

### Fluxo 1: Criar Nova Ordem de Serviço
1. Usuário toca em "+" na tela Ordens
2. Modal abre com formulário de nova ordem
3. Seleciona cliente (busca ou lista)
4. Preenche data, hora, endereço, descrição e valor
5. Salva e retorna à lista de ordens

### Fluxo 2: Completar Ordem de Serviço
1. Usuário toca em ordem na lista
2. Tela de detalhes abre com informações completas
3. Marca itens do checklist conforme executa
4. Adiciona fotos do serviço realizado
5. Marca como concluída e salva

### Fluxo 3: Agendar Serviço
1. Usuário toca em data no calendário
2. Modal de novo agendamento abre
3. Seleciona cliente e tipo de serviço
4. Confirma horário e salva
5. Evento aparece no calendário

### Fluxo 4: Buscar Cliente
1. Usuário toca na tela Clientes
2. Digita nome na barra de busca
3. Lista filtra em tempo real
4. Toca em cliente para ver detalhes e histórico

## Color Choices

### Paleta Principal
- **Azul Primário**: #0066CC (ações principais, botões, ícones ativos)
- **Verde Sucesso**: #00B050 (status concluído, confirmações)
- **Laranja Alerta**: #FF9500 (avisos, status pendente)
- **Vermelho Erro**: #E74C3C (cancelamento, erros)
- **Cinza Neutro**: #666666 (texto secundário, desabilitado)

### Paleta de Fundo (Light Mode)
- **Background**: #FFFFFF (branco puro)
- **Surface**: #F5F5F5 (cards, superfícies elevadas)
- **Border**: #E5E7EB (linhas divisórias)
- **Foreground**: #11181C (texto principal)
- **Muted**: #687076 (texto secundário)

### Paleta de Fundo (Dark Mode)
- **Background**: #151718 (cinza muito escuro)
- **Surface**: #1E2022 (cinza escuro para cards)
- **Border**: #334155 (linhas divisórias)
- **Foreground**: #ECEDEE (texto principal)
- **Muted**: #9BA1A6 (texto secundário)

## Typography

- **Headings (H1)**: 28pt, Bold, Foreground
- **Headings (H2)**: 22pt, Semibold, Foreground
- **Body**: 16pt, Regular, Foreground
- **Small**: 12pt, Regular, Muted
- **Caption**: 10pt, Regular, Muted

## Components

### Button
- **Primary**: Azul (#0066CC), altura 48pt, border-radius 8pt
- **Secondary**: Cinza (#F5F5F5), altura 48pt, border-radius 8pt
- **Tertiary**: Transparente com texto azul
- **Feedback**: Scale 0.97 ao pressionar + haptic feedback

### Card
- **Padding**: 16pt
- **Border Radius**: 12pt
- **Shadow**: Sutil (iOS-style)
- **Background**: Surface color

### Badge
- **Tamanhos**: Small (24pt), Medium (32pt)
- **Cores**: Verde (sucesso), Laranja (pendente), Cinza (neutro)
- **Estilos**: Filled, Outlined

### Stat Card
- **Layout**: Ícone + Label + Valor + Trend
- **Altura Mínima**: 120pt
- **Trend**: Seta verde (↑) para aumento, vermelha (↓) para redução

## Spacing & Layout

- **Padding Padrão**: 16pt
- **Margin Entre Cards**: 12pt
- **Gap Entre Elementos**: 8pt
- **Safe Area**: Respeitada em todos os dispositivos
- **Tab Bar Height**: 56pt + safe area bottom

## Interactions

- **Pull-to-Refresh**: Habilitado em listas
- **Swipe Gestures**: Deslizar para editar/deletar em listas
- **Long Press**: Opções adicionais em cards
- **Haptic Feedback**: Light para botões, Medium para ações críticas
- **Loading States**: Spinner ou skeleton screens

## Accessibility

- **Contrast Ratio**: Mínimo 4.5:1 para texto
- **Touch Targets**: Mínimo 44pt x 44pt
- **Font Scaling**: Suporta até 200% de aumento
- **Dark Mode**: Suporte completo com cores otimizadas
- **Screen Reader**: Todos os elementos têm labels apropriados
