# ui-craft

Uma skill para o [Claude Code](https://claude.com/claude-code) que leva as interfaces geradas pelo Claude ao padrão de **software comercial**, para web, mobile, desktop e TV.

## O problema

Uma interface gerada por IA costuma parecer boa num screenshot e ser ruim de usar:

- sem animações e transições;
- sem estados de carregando, vazio e erro;
- botões que não dão feedback;
- nada de teclado, gestos ou convenções da plataforma;
- layout que quebra em outros tamanhos de tela;
- um arquivo gigante em vez de componentes.

A ui-craft trata **UI como comportamento, não como imagem**. Ela obriga o Claude a seguir um processo e a testar a interface usando de verdade antes de dizer que terminou.

## O que a skill faz

1. **Identifica a plataforma** e carrega as regras dela: web, iOS/Android, desktop ou TV.
2. **Escreve um mapa de comportamento** antes do código: estados, transições, formas de entrada (mouse, toque, teclado, controle remoto) e casos com dados reais.
3. **Monta a tela com componentes de verdade**, em camadas: tokens → primitivos → compostos → features → telas.
4. **Aplica mínimos com números**: feedback em menos de 100 ms, durações e curvas de animação, área de toque de 44pt/48dp, foco visível, contraste AA.
5. **Testa em três camadas**:
   - screenshots e checagem automática de layout em 5 tamanhos de tela;
   - controle da UI: teclado, rede lenta, erro de API;
   - gravação em vídeo das animações, revisada por um modelo com visão de vídeo (via OpenRouter).
6. **Entrega** com a árvore de componentes e o que foi (e não foi) verificado.

## Estrutura

```
ui-craft/
├── SKILL.md                 # processo, mínimos e anti-padrões
├── references/
│   ├── components.md        # como quebrar a UI em componentes
│   ├── states.md            # carregando/vazio/erro, estados de controle, formulários
│   ├── motion.md            # durações, curvas de animação, springs, movimento reduzido
│   ├── testing.md           # screenshots, responsividade, vídeo
│   ├── web.md
│   ├── mobile.md
│   ├── desktop.md
│   └── tv.md
└── scripts/
    ├── capture.mjs          # screenshots em vários tamanhos + relatório de layout
    ├── record.mjs           # grava um fluxo em vídeo
    ├── review-video.mjs     # revisão do vídeo por um modelo via OpenRouter
    └── lib.mjs
```

## Instalação

Requer Node.js 18 ou mais recente.

```bash
git clone https://github.com/GabrielT7878/ui-craft.git
# Para todos os projetos:
cp -r ui-craft ~/.claude/skills/ui-craft
# Ou só para um projeto:
cp -r ui-craft <seu-projeto>/.claude/skills/ui-craft

cd ~/.claude/skills/ui-craft/scripts
npm install
npx playwright install chromium
```

No Windows (PowerShell):

```powershell
Copy-Item -Recurse ui-craft "$env:USERPROFILE\.claude\skills\ui-craft"
```

O Claude ativa a skill sozinho quando a tarefa envolve interface. Você também pode pedir explicitamente: *"use a skill ui-craft"*.

### Revisão de vídeo (opcional)

Para a revisão de vídeo, configure uma chave da [OpenRouter](https://openrouter.ai) e um modelo que aceite vídeo:

```bash
export OPENROUTER_API_KEY="sk-or-..."
# Opcional. Padrão: google/gemini-3.5-flash-lite (rápido e barato).
# Para revisões mais detalhadas: google/gemini-3.7-flash ou google/gemini-3.8-flash
export OPENROUTER_VIDEO_MODEL="google/gemini-3.5-flash-lite"
```

Sem a chave, o resto da skill funciona normalmente. O Claude apenas avisa que não verificou as animações por vídeo.

> **Privacidade:** os vídeos são enviados para a OpenRouter e para o provedor do modelo. Não grave telas com dados reais de clientes ou com segredos.

## Uso manual dos scripts

```bash
# Screenshots + relatório em todos os tamanhos de tela (sai com código 2 se houver problemas)
node scripts/capture.mjs http://localhost:5173 --out ui-check
node scripts/capture.mjs http://localhost:5173 --dark --viewports mobile-s,mobile,tablet

# Gravar um fluxo
node scripts/record.mjs http://localhost:5173 --flow flows/modal.mjs --viewport mobile --out ui-check/modal.webm

# Revisar o vídeo
node scripts/review-video.mjs ui-check/modal.webm --context "Abre o modal, preenche e fecha com Esc"
```

Um fluxo é um módulo que recebe a `page` do Playwright:

```js
// flows/modal.mjs
export default async function (page) {
  await page.getByRole('button', { name: 'Novo projeto' }).click();
  await page.waitForTimeout(800);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
}
```

Tamanhos de tela disponíveis: `mobile-s` (320), `mobile` (390), `tablet` (768), `laptop` (1280), `desktop` (1920), `tv` (1920).

O `capture.mjs` aponta:

| Problema | Quando |
|---|---|
| `horizontal-overflow` / `element-outside-viewport` | a página rola para o lado |
| `clipped-text` | texto cortado sem reticências |
| `overlapping-interactive` | botões ou links sobrepostos |
| `small-touch-target` | alvo menor que 44px (celular e tablet) |
| `broken-image` | imagem que não carregou |
| `consoleErrors` | erros de JavaScript na página |

## Contribuindo

A skill melhora com casos reais. Quando o Claude errar algo de UI mesmo com ela ativa:

1. Identifique a regra que faltou.
2. Adicione a regra no arquivo de referência da plataforma, com um número ou critério concreto (evite "deixe mais fluido").
3. Se for um erro recorrente, adicione também à lista de anti-padrões do `SKILL.md`.

## Licença

MIT
