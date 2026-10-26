# Estados — o que separa protótipo de produto

## Estados de dados (toda tela/área que busca dados)

| Estado | Como deve ser |
|---|---|
| **Carregando (1ª vez)** | Skeleton com o formato do conteúdo real. Se < 300 ms, não mostre nada (evita piscar); mostre o skeleton por no mínimo ~400 ms se aparecer. |
| **Recarregando** | Mantenha o conteúdo antigo visível + indicador discreto (barra no topo, spinner pequeno no botão). Nunca volte para skeleton. |
| **Vazio** | Ilustração/ícone leve + frase explicando + ação principal ("Criar primeiro projeto"). Diferencie "nada ainda" de "nenhum resultado para a busca" (este oferece limpar filtros). |
| **Erro** | O que aconteceu em linguagem humana + "Tentar novamente". Erro de uma parte não derruba a tela toda. Preserve o que o usuário digitou. |
| **Parcial / paginado** | Infinite scroll com loader no fim ou "Carregar mais"; mantenha posição de scroll ao voltar. |
| **Offline** | Banner discreto, ações enfileiradas ou desabilitadas com explicação; reconecta sozinho. |
| **Sem permissão** | Explica por que e como obter, não uma tela em branco. |

## Estados de controle

Todo botão, link, item de lista, card clicável, input:

- **Default**
- **Hover** (só ponteiro fino; `@media (hover: hover)`)
- **Pressed/active** — imediato
- **Focus-visible** — anel de 2px com offset, contraste ≥ 3:1, só para teclado (`:focus-visible`)
- **Disabled** — opacidade ~0.4–0.5, sem hover, cursor `not-allowed`; se possível explique o porquê (tooltip ou texto)
- **Loading** — spinner dentro do botão mantendo a largura, texto vira "Salvando…", não clicável
- **Selecionado/ativo** — indicação que não depende só de cor (ícone, peso, borda)
- **Erro** (inputs) — borda + ícone + mensagem abaixo, `aria-invalid`, `aria-describedby`

## Formulários

- Rótulo visível sempre (placeholder é exemplo, não rótulo).
- Validar no blur ou após a primeira tentativa de envio; depois disso, revalidar em tempo real para o erro sumir assim que corrigido.
- Tipo de teclado/autocomplete certo: `type="email"`, `inputmode="numeric"`, `autocomplete="one-time-code"`, etc.
- Enter envia; foco vai para o primeiro campo com erro ao falhar.
- Máscaras não brigam com o cursor; colar funciona.
- Botão de enviar desabilita durante envio; sucesso tem confirmação visível.
- Formulário longo: salva rascunho, avisa antes de sair com alterações não salvas.

## Feedback de ações

| Ação | Feedback |
|---|---|
| Rápida e reversível (curtir, favoritar) | Otimista, sem toast |
| Salvar | Estado no botão ("Salvo ✓" por ~2 s) ou toast curto |
| Destrutiva | Executa + toast "Item excluído · Desfazer" (5–8 s). Modal de confirmação só para irreversível de alto impacto, com o nome do item e botão com o verbo ("Excluir projeto"). |
| Longa (upload, export) | Progresso determinado com %, cancelável, continua se o usuário navegar |
| Copiar | Ícone vira check por ~1.5 s |

Toasts: canto consistente, empilham, pausam ao passar o mouse, não cobrem ações principais,
anunciados via `aria-live="polite"`.

## Dados reais

Teste com: nome de 1 caractere e de 80; números com 9 dígitos; moeda e datas no locale
(`Intl.NumberFormat`, `Intl.DateTimeFormat`); imagens quebradas (fallback com iniciais/ícone);
avatares faltando; 0, 1, 7 e 5000 itens; idioma com textos 30% maiores (alemão/português).
Use `text-overflow: ellipsis` + tooltip ou quebra de linha intencional — nunca texto vazando.
Listas grandes → virtualização.
