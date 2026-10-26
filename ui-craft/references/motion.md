# Movimento e animação

Animação não é enfeite: ela explica **de onde veio, para onde foi e o que mudou**. Sem ela a
interface parece quebrada ("piscou e mudou"). Com exagero, parece lenta.

## Durações (referência)

| Tipo | Duração |
|---|---|
| Feedback de press/hover, troca de cor | 80–150 ms |
| Tooltip, toggle, checkbox, pequenos elementos | 150–200 ms |
| Menus, dropdowns, popovers, toasts | 180–250 ms (saída ~30% mais rápida que a entrada) |
| Modais, sheets, drawers | 250–350 ms |
| Transição de página/tela | 300–400 ms |
| Mobile: telas inteiras | 300–450 ms (seguindo o sistema) |
| TV: movimento de foco | 150–250 ms, sempre suave, nunca "teleporta" |

Nada de interação cotidiana acima de 500 ms.

## Easing

- Entrada: **ease-out** — `cubic-bezier(0.16, 1, 0.3, 1)` (rápida no começo, assenta suave).
- Saída: **ease-in** — `cubic-bezier(0.7, 0, 0.84, 0)`, mais curta.
- Movimento na tela (de A para B): **ease-in-out** — `cubic-bezier(0.65, 0, 0.35, 1)`.
- Gestos e coisas arrastáveis: **spring** (física), herda a velocidade do dedo.
  Ex.: Framer Motion `{ type: "spring", stiffness: 400, damping: 30 }`; SwiftUI `.spring(response: 0.35, dampingFraction: 0.85)`; Compose `spring(dampingRatio = 0.8f, stiffness = Spring.StiffnessMediumLow)`.
- **Nunca `linear`** para UI (só para spinners e barras de progresso indeterminadas).

## O que animar

- Prefira `transform` (translate, scale) e `opacity` — rodam na GPU, 60/120 fps.
- Evite animar `width`, `height`, `top`, `left`, `margin`, `box-shadow` grande. Para altura auto, use técnicas de grid (`grid-template-rows: 0fr → 1fr`), FLIP, ou a lib de animação de layout.

## Padrões que devem existir

- **Press**: scale 0.97–0.98 ou escurecer/ripple. Imediato no pointerdown, não no click.
- **Entrada de modal**: fade do backdrop + scale 0.96→1 e opacity 0→1 (ou slide de baixo no mobile).
- **Menus/popovers**: originam do gatilho (`transform-origin` no ponto de onde saem).
- **Listas**: itens novos entram com fade + leve slide; removidos colapsam altura (o resto desliza, não pula). Stagger de 20–40 ms por item, máximo ~8 itens com stagger.
- **Troca de abas/conteúdo**: crossfade curto ou slide na direção da navegação.
- **Elemento compartilhado**: card → detalhe expande a partir do card (View Transitions API, `matchedGeometryEffect`, `SharedTransitionLayout`, `layoutId` no Framer Motion).
- **Skeleton**: shimmer suave (1.2–1.6 s, loop) ou pulse de opacidade.
- **Números que mudam**: contador anima ou faz roll; badges dão um "pop" leve.
- **Sucesso**: check animado curto; erro: shake sutil (3 oscilações, ~300 ms) no campo.

## Movimento reduzido

Sempre:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Melhor ainda: troque slides/scale por fades curtos em vez de remover tudo. Nativo:
`UIAccessibility.isReduceMotionEnabled` / `@Environment(\.accessibilityReduceMotion)`,
Android `Settings.Global.ANIMATOR_DURATION_SCALE`.

## Bibliotecas recomendadas

- React: `motion` (Framer Motion), `@formkit/auto-animate` para listas rápidas.
- Vue: `<Transition>`/`<TransitionGroup>`, `@vueuse/motion`.
- Svelte: `svelte/transition`, `svelte/animate` (flip).
- Web sem framework: CSS transitions + View Transitions API + Web Animations API.
- React Native: Reanimated + Gesture Handler (nunca a Animated API sem `useNativeDriver`).
- Flutter: implicit animations (`AnimatedContainer`, `AnimatedSwitcher`), `Hero`, `animations` package.
