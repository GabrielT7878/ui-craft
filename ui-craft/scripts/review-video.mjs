// Envia um vídeo de UI para um modelo com visão de vídeo via OpenRouter e imprime os problemas.
// Uso: node review-video.mjs <video.webm|mp4|mov> [--context "o que o fluxo faz"] [--model id]
// Env: OPENROUTER_API_KEY (obrigatório), OPENROUTER_VIDEO_MODEL (opcional)
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const file = args._[0];
const key = process.env.OPENROUTER_API_KEY;
const model = args.model || process.env.OPENROUTER_VIDEO_MODEL || 'google/gemini-3.7-flash';

if (!file) {
  console.error('Uso: node review-video.mjs <video> [--context "..."] [--model id]');
  process.exit(1);
}
if (!key) {
  console.error('Defina OPENROUTER_API_KEY no ambiente.');
  process.exit(1);
}

const mime = { '.webm': 'video/webm', '.mp4': 'video/mp4', '.mov': 'video/quicktime' }[path.extname(file).toLowerCase()];
if (!mime) {
  console.error('Formato não suportado. Use .webm, .mp4 ou .mov.');
  process.exit(1);
}
const data = await fs.readFile(file);
if (data.length > 25 * 1024 * 1024) {
  console.error(`Vídeo com ${(data.length / 1048576).toFixed(1)} MB. Grave um fluxo mais curto (ideal < 20 MB).`);
  process.exit(1);
}

const prompt = `Você é um revisor de qualidade de interfaces de software comercial.
Este vídeo é uma gravação de tela de uma UI sendo usada.
${args.context ? `O fluxo esperado: ${args.context}\n` : ''}
Analise movimento e comportamento visual, quadro a quadro quando necessário. Procure:
- elementos que aparecem ou somem de estalo, sem transição;
- animações travando, pulando quadros ou com velocidade irregular;
- animações lentas demais (> 500 ms em interação comum) ou rápidas demais para perceber;
- curva de animação estranha (linear, para de repente, "quica" sem motivo);
- salto de layout (conteúdo empurrado quando algo carrega ou aparece);
- piscadas, flash de conteúdo errado ou de tema errado;
- elementos sobrepostos, desalinhados, cortados ou fora do lugar durante ou após animações;
- foco do teclado invisível ou pulando para lugares inesperados;
- rolagem que trava ou cabeçalhos fixos que tremem;
- qualquer coisa que um usuário acharia "amadora".

Responda em português, só em JSON neste formato:
{"issues":[{"time":"mm:ss","severity":"alta|média|baixa","element":"...","problem":"...","suggestion":"..."}],"overall":"uma frase"}
Liste apenas o que você realmente vê no vídeo. Se não houver problemas, devolva "issues": [].`;

const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model,
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'video_url', video_url: { url: `data:${mime};base64,${data.toString('base64')}` } },
      ],
    }],
  }),
});

const body = await res.json().catch(() => null);
if (!res.ok || !body?.choices?.length) {
  console.error(`Erro da OpenRouter (${res.status}):`, JSON.stringify(body?.error ?? body, null, 2));
  process.exit(1);
}
console.log(`Modelo: ${body.model ?? model}\n`);
console.log(body.choices[0].message.content);
