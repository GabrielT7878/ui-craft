---
name: ui-craft
description: Padrão de qualidade de software comercial para qualquer interface (web, mobile iOS/Android, desktop, TV). Use SEMPRE que for criar, alterar ou revisar UI — telas, componentes, apps, dashboards, landing pages, apps React/Vue/Svelte/Flutter/SwiftUI/Compose/Electron/Tauri/React Native/TV. Força estados completos, animações, convenções nativas da plataforma, acessibilidade, teclado/foco e um teste de uso real antes de dizer que está pronto.
---

# UI Craft — interfaces que parecem produto comercial

## O problema que esta skill resolve

Interfaces geradas costumam **parecer** boas num screenshot e serem **ruins de usar**: sem
transições, sem estados de loading/erro/vazio, botões sem feedback, nada de teclado, gestos
ou convenções da plataforma, layout que quebra com dados reais. O usuário sente que é "app
amador" mesmo sem saber dizer por quê.

Regra mestra: **UI é comportamento, não imagem.** Cada elemento precisa responder a toque,
hover, foco, teclado, espera, erro e dados reais. Se você só pensou em como ela fica parada,
você fez metade do trabalho.

## Processo obrigatório

### 1. Identifique a plataforma e leia a referência dela

Antes de escrever código, leia o arquivo de referência correspondente:

| Alvo | Leia |
|---|---|
| Web (site, web app, dashboard, PWA) | `references/web.md` |
| iOS / Android / React Native / Flutter | `references/mobile.md` |
| Desktop (Electron, Tauri, WPF, WinUI, macOS, Qt) | `references/desktop.md` |
| TV (Android TV, tvOS, Tizen, webOS, Fire TV) | `references/tv.md` |

Sempre leia também `references/motion.md`, `references/states.md`,
`references/components.md` (como quebrar a UI em componentes) e `references/testing.md`
(screenshots, responsividade e revisão de vídeo).
Web responsiva que também roda em celular → leia `web.md` **e** `mobile.md`.

### 2. Antes de codar, escreva o "mapa de comportamento"

Para cada tela, liste (pode ser curto, em comentário ou na resposta):

- **Estados de dados**: carregando, vazio, erro, parcial, sucesso, offline, sem permissão.
- **Estados de cada controle interativo**: normal, hover, pressed, focus, disabled, loading, selecionado.
- **Transições**: o que entra, sai, muda de tamanho ou de posição — e como anima.
- **Entradas**: mouse, toque, teclado, D-pad/controle, gestos — quais se aplicam e o que cada uma faz.
- **Convenções da plataforma** que o usuário espera (voltar, pull-to-refresh, atalhos, menu de contexto, etc.).
- **Dados reais**: textos longos, nomes com 60 caracteres, 0 itens, 10.000 itens, imagem que não carrega.

Se algum item não tem resposta, a tela não está pronta.

### 3. Implemente com o padrão comercial

Primeiro desenhe a **árvore de componentes** (primitivos em `ui/`, compostos, features, tela —
ver `components.md`). Reaproveite o que já existe. Telas só compõem; estilos e estados vivem nos
componentes.

Mínimos inegociáveis (detalhes nos arquivos de referência):

1. **Todo elemento clicável tem feedback em < 100 ms** (pressed/hover/ripple/scale) e cursor/affordance correto.
2. **Toda ação assíncrona** desabilita o gatilho, mostra progresso no próprio lugar e trata erro com recuperação (tentar de novo), nunca falha silenciosa.
3. **Nada aparece ou some "de estalo"**: modais, menus, toasts, listas, troca de abas, expandir/recolher usam transição (ver `motion.md`). Respeite `prefers-reduced-motion` / configurações de acessibilidade.
4. **Skeletons** com o formato do conteúdo final no lugar de spinners de tela cheia; layout não pula quando os dados chegam (reserve espaço, dimensões de imagem).
5. **Foco visível e navegação completa por teclado** (web/desktop) ou **D-pad** (TV). Ordem de foco lógica, foco preso dentro de modais, Esc fecha.
6. **Convenções nativas**: botão voltar/gesto de voltar, safe areas, área de toque mínima, atalhos de sistema, rolagem nativa com inércia. Não reinvente controles do sistema mal.
7. **Hierarquia visual clara**: uma ação primária por contexto, escala tipográfica consistente, espaçamento numa grade (4/8 px), contraste AA (4.5:1 texto, 3:1 componentes).
8. **Design tokens** (cores, espaço, raio, sombra, duração, easing) em um lugar só; suporte a tema claro e escuro quando a plataforma tem.
9. **Copy útil**: botões com verbos ("Salvar alterações", não "OK"), erros dizem o que aconteceu e o que fazer, estados vazios explicam e oferecem a próxima ação.
10. **Otimista quando seguro**: curtir, marcar, reordenar atualizam na hora e revertem com aviso se falhar. Ações destrutivas: desfazer (toast com "Desfazer") é melhor que modal de confirmação.

### 4. Teste USANDO, não olhando

Antes de dizer "pronto", rode a interface e teste em três camadas (comandos em `testing.md`):

1. **Screenshots em todos os tamanhos de tela** com `scripts/capture.mjs`. Corrija tudo no
   `report.json` (overflow, texto cortado, sobreposição, alvo pequeno) e **olhe as imagens** em busca
   de desalinhamento e espaçamento torto. Repita até ficar limpo.
2. **Controle a UI**: clique, digite, navegue só pelo teclado, simule rede lenta e erro de API.
3. **Vídeo** de cada animação ou fluxo novo com `scripts/record.mjs` e revisão por
   `scripts/review-video.mjs` (modelo de vídeo via OpenRouter). Confirme cada problema apontado
   antes de corrigir.

Se não puder rodar alguma camada (sem servidor, sem chave, plataforma nativa sem emulador), diga
explicitamente o que não foi verificado.

**Checklist de uso (todas devem ser "sim")**

- [ ] Clicar/tocar em qualquer coisa dá feedback imediato?
- [ ] Consigo fazer o fluxo principal só com teclado (ou só com D-pad na TV)? O foco é sempre visível?
- [ ] Com rede lenta (3 s), a tela mostra skeleton/progresso e nada pula de lugar?
- [ ] Com erro de API, aparece mensagem útil com "Tentar novamente"?
- [ ] Lista vazia tem estado vazio desenhado com ação?
- [ ] Texto enorme, número grande, 1 item e 1000 itens não quebram o layout?
- [ ] Modais/menus abrem e fecham animados, fecham com Esc/clique fora/voltar, e devolvem o foco?
- [ ] Clique duplo em "Enviar" não envia duas vezes?
- [ ] Recarregar/voltar preserva o que o usuário esperaria (URL, scroll, rascunho)?
- [ ] Funciona em tela pequena e grande da plataforma (e rotação, no mobile)?
- [ ] Tema escuro (se existe) não tem texto ilegível nem branco estourado?
- [ ] Movimento reduzido ligado → animações viram fades curtos ou somem?

### 5. Ao entregar

Mostre a árvore de componentes e diga em poucas linhas: quais estados e interações foram
cobertos, em quais tamanhos de tela foi verificado, o que o vídeo revelou e o que ficou de fora. Não diga "interface moderna e intuitiva" — mostre o que ela faz.

## Anti-padrões que reprovam a entrega

- Spinner centralizado em tela branca enquanto carrega.
- `alert()` / `window.confirm()` / diálogos nativos crus para feedback.
- Botão que não muda nada ao ser clicado enquanto a requisição roda.
- `div` com `onClick` sem role, tabindex e suporte a Enter/Espaço.
- `outline: none` sem substituto de foco.
- Modal sem animação, sem Esc, sem trap de foco, que deixa a página rolar por trás.
- Hover como única forma de acessar algo (não existe hover em toque e TV).
- Áreas de toque de 24 px no mobile.
- Animação com `linear`, ou duração > 500 ms em interação comum, ou animando `width/height/top/left` quando dava para usar `transform/opacity`.
- Cores hardcoded espalhadas, espaçamentos aleatórios (13px, 17px, 22px).
- Placeholder como único rótulo de campo.
- Validação que só aparece depois de enviar, ou que grita erro enquanto o usuário ainda digita.
- Lorem ipsum e dados perfeitos que escondem problemas de layout.
