# Mobile (iOS, Android, React Native, Flutter, web no celular)

O usuário de celular tem anos de memória muscular do sistema. Quebrar convenção = "app ruim".
Siga Human Interface Guidelines (iOS) e Material 3 (Android). Em cross-platform, **adapte por
plataforma** onde o comportamento difere (voltar, navegação, diálogos, pickers, haptics).

## Fundamentos

- Área de toque mínima: **44×44 pt (iOS) / 48×48 dp (Android)**, com ≥ 8 dp entre alvos. O visual pode ser menor, a área não.
- Safe areas sempre: notch, Dynamic Island, barra de gestos, câmera em punch-hole. (`SafeAreaView`/`react-native-safe-area-context`, `SafeArea` no Flutter, `WindowInsets` no Compose.)
- Ações principais na metade de baixo da tela (zona do polegar). Tab bar embaixo.
- Tipografia do sistema e respeito a Dynamic Type / escala de fonte — teste com fonte em 200%.
- Tema claro/escuro seguindo o sistema. Status bar com cor/estilo correto em cada tela.
- Orientação: suporte rotação ou trave conscientemente; tablets e foldables não devem ser celular esticado.

## Navegação

- **Android**: botão/gesto de voltar do sistema SEMPRE funciona (fecha sheet → fecha modal → volta tela → sai). Predictive back no Android 14+.
- **iOS**: swipe da borda esquerda volta; títulos grandes que colapsam ao rolar; modais em sheet com arrastar para fechar.
- Stack nativo (React Navigation native-stack, `NavigationStack`, Navigation Compose, go_router) com transições do sistema — não faça transições caseiras de tela.
- Tocar na aba ativa rola para o topo / volta à raiz.
- Preserve estado de cada aba e posição de scroll.
- Deep links abrem a tela certa com a pilha certa.

## Gestos e interações esperadas

- Pull-to-refresh em listas e feeds.
- Swipe em itens de lista para ações (arquivar/excluir) com cor e ícone revelados, e desfazer.
- Long press abre menu de contexto (iOS context menu com preview; Android menu/seleção múltipla).
- Bottom sheets com detentes (médio/grande), arrastáveis, fecham ao arrastar para baixo, fundo escurece progressivamente.
- Scroll com inércia e overscroll nativo (bounce no iOS, stretch no Android). Nunca bloqueie.
- Teclado: a tela sobe para o campo ativo não ficar coberto (`KeyboardAvoidingView`/`keyboard-controller`, `imePadding()`), toque fora fecha teclado, botão "próximo" pula para o próximo campo, tipo de teclado correto, autofill de senha/OTP.
- Gestos seguem o dedo 1:1 e terminam com spring que herda a velocidade (Reanimated + Gesture Handler, não JS thread).

## Feedback

- **Haptics** em momentos certos: seleção (picker, toggle), sucesso/erro, long press, chegar ao limite de pull-to-refresh. Leves, nunca em todo toque. (`expo-haptics`, `UIImpactFeedbackGenerator`, `HapticFeedback` no Flutter, `performHapticFeedback` no Android.)
- Press state visível: opacidade/escala no iOS, ripple no Android (`Pressable` com `android_ripple`).
- Componentes nativos quando existirem: date/time picker, share sheet, action sheet, alertas do sistema (com moderação), seletor de fotos, permissões.

## Desempenho percebido

- 60/120 fps: animações na UI thread, listas com `FlashList`/`LazyColumn`/`ListView.builder`, imagens com cache (`expo-image`, Coil, `cached_network_image`).
- Splash screen nativa que transiciona suavemente para a primeira tela; nada de tela branca.
- Conteúdo em cache aparece instantâneo e atualiza por trás.
- Permissões pedidas no contexto, com explicação antes do diálogo do sistema; tratar "negado" com caminho para Configurações.

## Web no celular

Tudo de `web.md` + `100dvh`, inputs ≥ 16px, `touch-action`, `overscroll-behavior` em modais,
sem hover como requisito, `-webkit-tap-highlight-color: transparent` com press state próprio,
alvos de 44px.
