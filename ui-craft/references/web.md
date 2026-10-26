# Web

## Base técnica

- HTML semântico: `button` para ações, `a href` para navegação, `nav`, `main`, `header`, `dialog`, `label for`. Se usar `div` interativa: `role`, `tabindex="0"`, Enter/Espaço.
- Navegação muda a URL (rotas reais). Voltar do navegador funciona; abrir em nova aba (Ctrl/Cmd+clique, botão do meio) funciona em links.
- Filtros, abas, busca e paginação refletidos na URL (query string) quando fizer sentido compartilhar.
- Scroll restaurado ao voltar; scroll para o topo ao ir para página nova.
- `<title>` muda por página.
- Use componentes acessíveis prontos em vez de reinventar: Radix / shadcn/ui / React Aria / Headless UI / Ark UI / Bits UI / Melt UI. Eles já resolvem foco, teclado, ARIA, portal e posicionamento.

## Layout e responsividade

- Mobile-first; breakpoints por conteúdo (aprox. 640 / 768 / 1024 / 1280).
- Largura de leitura ~60–75 caracteres; containers com `max-width`.
- `min-height: 100dvh` (não `100vh`) para telas cheias no celular.
- `env(safe-area-inset-*)` e `viewport-fit=cover` em PWA/fullscreen.
- Inputs com `font-size` ≥ 16px no mobile (evita zoom no iOS).
- `@media (hover: hover) and (pointer: fine)` para hovers; em toque, alvos ≥ 44×44 px.
- Imagens com `width/height` ou `aspect-ratio` (sem layout shift), `loading="lazy"`, `srcset`.
- Fontes: `font-display: swap`, pré-carregue a principal, `font-variant-numeric: tabular-nums` em números que mudam/tabelas.
- `scrollbar-gutter: stable` para evitar pulo quando aparece scrollbar.
- Modal aberto bloqueia scroll do body sem pular layout.

## Teclado (o que um usuário de produto comercial espera)

- Tab/Shift+Tab em ordem visual; skip link "Pular para o conteúdo".
- Esc fecha modal, popover, menu, busca expandida — e devolve foco ao gatilho.
- Setas navegam dentro de menus, listas, tabs, radio groups, grids (roving tabindex).
- Enter envia formulários; Ctrl/Cmd+Enter envia em textareas de chat/comentário.
- Atalhos de produto quando fizer sentido: `/` ou Ctrl/Cmd+K para busca/command palette, com dica visível (`kbd`).
- Detecte plataforma para mostrar ⌘ no Mac e Ctrl nos outros.

## Interações esperadas

- Dropdowns/popovers se reposicionam na borda da tela (Floating UI).
- Tooltips: aparecem após ~500 ms, somem rápido, aparecem também no foco; nunca contêm informação essencial.
- Tabelas: cabeçalho fixo, ordenação clicável com indicador, seleção com Shift+clique para intervalo, colunas que não espremem conteúdo, rolagem horizontal contida no mobile.
- Drag and drop com placeholder, auto-scroll perto das bordas, e alternativa por teclado (dnd-kit).
- Upload: área de soltar destaca no dragover, colar imagem funciona, preview, progresso, cancelar.
- Busca: debounce ~250 ms, resultado destaca o termo, limpar com X e Esc.
- Links externos sinalizados; texto selecionável onde faz sentido (não bloqueie seleção sem motivo).

## Visual

- Tokens via CSS variables; tema escuro com `prefers-color-scheme` + toggle persistido; sem flash do tema errado no carregamento (script inline antes do paint).
- Escuro não é preto puro: fundos ~#0B0B0F–#18181B, elevação clareando a superfície, textos ~90% branco.
- Sombras em camadas suaves (2–3 sombras com opacidade baixa) em vez de uma sombra preta dura.
- Escala tipográfica fixa (ex.: 12/14/16/20/24/32/48), line-height 1.4–1.6 em texto, 1.1–1.25 em títulos, `letter-spacing` negativo leve em títulos grandes.
- Bordas de 1px com baixo contraste (ex.: `rgb(0 0 0 / 0.08)`) e raios consistentes (ex.: 6/10/16).
- Ícones de um único conjunto (Lucide, Phosphor, Heroicons), tamanho e stroke consistentes.

## Performance percebida

- Transições de rota com View Transitions API ou a lib do framework.
- Prefetch de links no hover/viewport.
- Interação não espera rede: UI otimista, `useTransition`/`startTransition`, sem travar a main thread (INP < 200 ms).
- Lista longa virtualizada (TanStack Virtual).
