# TV (Android TV/Google TV, tvOS, Fire TV, Tizen, webOS, web em TV)

Experiência de 3 metros (10-foot UI) com controle remoto. **Não existe toque nem hover.** O
foco É a interface. Se o foco não é óbvio e fluido, o app é inutilizável.

## Foco (o mais importante)

- Sempre exatamente **um** elemento focado, sempre visível. Nunca foco "perdido".
- Indicador forte: escala 1.05–1.1 + borda/brilho + elevação/sombra, animado em 150–250 ms com ease-out. Elementos não focados ficam levemente apagados em telas de catálogo.
- Navegação direcional previsível: seta vai para o elemento visualmente mais próximo naquela direção. Defina explicitamente onde a lógica automática erra (`nextFocusDown`, `focusSection`/`FocusGroup`, Norigin Spatial Navigation / `@noriginmedia/norigin-spatial-navigation` em web/React, `focusSection()` no tvOS).
- **Memória de foco**: voltar para uma fileira/tela restaura o item que estava focado.
- Foco inicial definido em toda tela (normalmente o conteúdo principal, não o menu).
- Nas bordas: não pular para lugares aleatórios; fileiras podem parar no fim (ou dar wrap só se for padrão do app).
- Ao rolar, o item focado fica em posição estável (ex.: fileira focada fixa a ~1/3 da tela; carrossel rola mantendo o foco numa coluna fixa) — a tela se move, o olho não precisa caçar.
- tvOS: efeito parallax/“lift” nos cards (focus engine nativo, `.focusable()`, `.hoverEffect` / `.buttonStyle(.card)`).

## Controle remoto

- **Voltar** sempre funciona e é previsível: fecha overlay → volta tela → na home, vai para o menu/aba inicial → só então sai do app (com confirmação opcional).
- OK/Enter seleciona; segurar OK pode abrir opções.
- Teclas de mídia (play/pause, avançar, voltar) funcionam em qualquer tela com player.
- Segurar seta acelera a rolagem; sem travar com repetição de tecla (throttle de input e animações que não acumulam fila).
- Botão menu/opções abre ações contextuais.
- Digitação é dolorosa: ofereça busca por voz, sugestões, login por QR code/código no celular, teclado na tela grande com layout de grade.

## Layout 10-foot

- Overscan/safe area: margens de ~5% (aprox. 48px horiz × 27px vert em 1920×1080). Nada importante nas bordas.
- Texto mínimo ~24px em 1080p para corpo, títulos 32–48px+. Menos texto, mais imagem.
- Contraste alto, evite branco puro em grandes áreas (#F0F0F0 sobre fundo escuro), evite linhas de 1px (cintilam).
- Padrão de catálogo: hero/destaque no topo + fileiras horizontais de cards; menu lateral que expande ao receber foco ou abas no topo.
- Cards com proporção consistente por fileira; título da fileira visível; contagem de itens que caiba bem.
- Fundo pode mudar para a arte do item focado (com crossfade e debounce ~300 ms).

## Desempenho

- Hardware de TV é fraco: anime só `transform/opacity`, imagens no tamanho exato exibido, virtualize fileiras e itens, pré-carregue imagens das fileiras vizinhas.
- Resposta ao toque de seta < 100 ms, mesmo que a imagem ainda não tenha carregado (placeholder com cor dominante).
- Player: controles somem após ~3–5 s, reaparecem com qualquer tecla, scrubbing com prévia, retomar de onde parou, legendas e áudio fáceis de achar.

## Teste

Navegue o app inteiro **só com setas, OK e Voltar**. Teste segurando seta por 3 s em uma
fileira longa. Se em algum momento você não sabe onde está o foco, reprovou.
