# Desktop (Electron, Tauri, WinUI/WPF, macOS/SwiftUI/AppKit, Qt, Flutter desktop)

Usuário de desktop espera densidade, velocidade, teclado e integração com o sistema. Um app
desktop que parece "site num iframe" é a reclamação nº 1.

## Janela e integração com o sistema

- Barra de título nativa ou customizada **com** área arrastável, duplo clique maximiza, botões no lugar certo (esquerda no macOS, direita no Windows), snap layouts do Windows funcionando.
- Lembra tamanho, posição e monitor da janela; tamanho mínimo definido; layout responde a redimensionamento sem quebrar.
- Menu da aplicação (macOS: menu bar completa com Arquivo/Editar/Visualizar/Janela/Ajuda; Windows: menu ou ribbon/command bar). Editar → Desfazer/Refazer/Recortar/Copiar/Colar/Selecionar tudo funcionando.
- Atalhos do sistema: Cmd/Ctrl+Q/W/N/S/Z/Shift+Z/F/,/+/-/0, Cmd+, abre Preferências no Mac, F11/Ctrl+Cmd+F tela cheia.
- Tema claro/escuro e cor de destaque do sistema; materiais nativos quando possível (Mica/Acrylic no Windows 11, vibrancy no macOS).
- Fonte do sistema (Segoe UI Variable / SF Pro) e tamanhos de desktop (13–14px corpo).
- Notificações nativas, ícone na bandeja/dock com badge quando fizer sentido, deep links, abrir arquivos por "Abrir com"/arrastar no ícone.
- Escala de DPI (100–200%) e múltiplos monitores com DPIs diferentes sem borrão.
- Nada de seleção de texto em chrome da UI (botões, labels de menu); seleção permitida em conteúdo.

## Mouse

- Hover em tudo que é clicável; cursor certo (default em botões de app nativo — pointer só em links; resize, grab, text).
- Clique direito abre menu de contexto relevante em itens, texto e áreas vazias.
- Duplo clique abre/edita; arrastar e soltar entre áreas e de/para o sistema de arquivos.
- Tooltips em ícones (com atalho exibido, ex.: "Negrito  Ctrl+B").
- Painéis redimensionáveis com divisória arrastável, tamanho lembrado, duplo clique reseta.
- Scroll suave, rolagem horizontal com Shift+roda, zoom com Ctrl+roda onde fizer sentido.

## Teclado (desktop é teclado-first)

- Tudo acessível sem mouse: Tab, setas em listas/árvores/grids, Enter abre, Delete exclui (com desfazer), F2 renomeia, Espaço seleciona, Home/End/PageUp/PageDown.
- Seleção múltipla: Ctrl/Cmd+clique, Shift+clique, Ctrl/Cmd+A.
- Command palette (Ctrl/Cmd+K ou Ctrl/Cmd+Shift+P) em apps com muitas ações.
- Mnemônicos (Alt+letra) no Windows.
- Desfazer/refazer para ações do usuário, não só em campos de texto.

## Layout

- Densidade maior que mobile: linhas de lista 28–36px, controles 28–32px de altura.
- Estrutura clássica: sidebar (recolhível) + conteúdo + painel de detalhes/inspector opcional; toolbar no topo; status bar quando houver estado relevante.
- Estados de foco de janela: quando a janela perde foco, seleção fica cinza (padrão nativo).

## Desempenho

- Abre rápido (< 1–2 s até algo útil), mostra janela só quando pronta (sem tela branca — `ready-to-show` no Electron).
- Operações longas em background com progresso e cancelar; nunca congelar a UI.
- Funciona offline; salva automaticamente ou avisa antes de fechar com alterações.
- Electron/Tauri: desabilite comportamentos de browser que denunciam "site": zoom acidental, menu de contexto padrão do Chromium, arrastar imagens/links da UI, seleção de texto na UI, navegação por backspace.
