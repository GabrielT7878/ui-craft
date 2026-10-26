# Testar a UI: controlar, fotografar, gravar

Três camadas, nesta ordem. Os scripts ficam em `scripts/` desta skill (instale uma vez:
`npm install` dentro de `scripts/` e depois `npx playwright install chromium`).
Nos comandos abaixo, `<skill>` é a pasta onde esta skill está instalada.

## 1. Screenshots + checagem automática de layout (toda mudança visual)

```
node <skill>/scripts/capture.mjs http://localhost:5173 --out ui-check
node <skill>/scripts/capture.mjs http://localhost:5173/settings --dark --viewports mobile-s,mobile,tablet,desktop
```

Para cada tamanho de tela (padrão: 320, 390, 768, 1280, 1920 de largura) ele salva um screenshot
da área visível e um da página inteira, e gera `report.json` com:

- **overflow horizontal** (a página rola para o lado) e quais elementos vazam;
- **texto cortado** (conteúdo maior que a caixa sem reticências);
- **elementos interativos sobrepostos**;
- **alvos de toque < 44px** nos tamanhos de celular/tablet;
- **imagens quebradas**.

Depois:
1. Corrija tudo que o relatório apontar (ou justifique por que é intencional).
2. **Abra e olhe os screenshots** (Read na imagem). Procure: alinhamento, espaçamentos irregulares, coisas fora da grade, quebra de linha feia, elementos espremidos, hierarquia confusa, tema escuro ilegível.
3. Repita até ficar limpo em todos os tamanhos.

Para estados que só aparecem com interação (modal aberto, menu, erro de formulário), use `--flow`
com um arquivo que leva a página até o estado antes da foto (mesmo formato do `record.mjs` abaixo).

## 2. Controlar a UI (fluxos e teclado)

Use o navegador (Playwright, ou Claude in Chrome se estiver disponível) para executar o
checklist de uso do `SKILL.md`: clicar, digitar, enviar com erro, navegar só com Tab/Enter/Esc,
voltar do navegador. Simule rede lenta e falha de API:

```js
await page.route('**/api/**', r => setTimeout(() => r.continue(), 3000)); // lenta
await page.route('**/api/**', r => r.fulfill({ status: 500 }));            // erro
```

Se o projeto já tem testes (Vitest/Jest + Testing Library, Playwright test), escreva testes de
comportamento para os componentes novos: renderiza estados, responde a teclado, chama `onX`.

## 3. Vídeo: fluidez e corretude das animações

Screenshots não mostram animação. Grave o fluxo e mande para um modelo com visão de vídeo.

```
node <skill>/scripts/record.mjs http://localhost:5173 --flow flows/open-modal.mjs --viewport mobile --out ui-check/open-modal.webm
node <skill>/scripts/review-video.mjs ui-check/open-modal.webm --context "Clica em 'Novo projeto', modal abre, preenche e fecha com Esc"
```

Arquivo de fluxo (`flows/open-modal.mjs`):

```js
export default async function (page) {
  await page.getByRole('button', { name: 'Novo projeto' }).click();
  await page.waitForTimeout(800);            // deixa a animação terminar no vídeo
  await page.getByLabel('Nome').fill('Teste');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
}
```

Sem `--flow`, ele grava um passeio padrão: rolagem lenta para baixo e para cima e Tab pelos
primeiros elementos focáveis.

O `review-video.mjs` envia o vídeo para a OpenRouter (precisa de `OPENROUTER_API_KEY` no ambiente;
modelo em `OPENROUTER_VIDEO_MODEL`) e devolve uma lista de problemas com tempo do vídeo:
aparições bruscas, travadas, salto de layout, piscadas, animação lenta demais, foco invisível.

**Como usar a resposta:** trate como pista, não verdade. Para cada problema, confirme olhando o
código ou os quadros (abaixo). A gravação do Playwright pode perder quadros sozinha; uma "travada"
só é real se aparecer de novo em outra gravação.

**Ver os quadros você mesmo** (precisa de ffmpeg):

```
ffmpeg -i ui-check/open-modal.webm -vf fps=12 ui-check/frames/%03d.png
```

Leia os quadros em sequência ao redor do momento suspeito.

**Privacidade:** o vídeo sai da máquina e vai para a OpenRouter e o provedor do modelo. Não grave
telas com dados reais de clientes ou segredos.

## Outras plataformas

- **Electron:** Playwright controla Electron (`_electron.launch`), os mesmos checks valem.
- **Android (emulador/aparelho):** `adb exec-out screencap -p > shot.png`; vídeo com `adb shell screenrecord /sdcard/v.mp4` e `adb pull`. Tamanhos diferentes: emuladores com perfis distintos ou `adb shell wm size 1080x1920`.
- **iOS Simulator:** `xcrun simctl io booted screenshot shot.png` e `xcrun simctl io booted recordVideo v.mp4`.
- **Flutter:** golden tests (`matchesGoldenFile`) em vários tamanhos com `tester.view.physicalSize`.
- **TV web (Tizen/webOS):** use `capture.mjs --viewports tv` e grave navegando com setas via `page.keyboard.press('ArrowRight')`.

Os vídeos de qualquer uma dessas fontes podem ir para o `review-video.mjs`.
