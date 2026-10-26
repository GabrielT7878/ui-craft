# Componentização de verdade

Objetivo: qualquer pessoa abre a pasta e entende a UI como uma árvore de peças. Uma tela é
**composição** de componentes; um componente é **composição** de componentes menores. Nada de
arquivo de 600 linhas com 40 `div`s estilizadas na mão.

## Camadas (de baixo para cima)

| Camada | O que é | Exemplos | Pode conhecer |
|---|---|---|---|
| `tokens` | Valores de design | cores, espaço, raio, sombra, duração, easing, tipografia | nada |
| `ui/` (primitivos) | Peças genéricas, sem regra de negócio | `Button`, `IconButton`, `Input`, `Card`, `Stack`, `Text`, `Avatar`, `Badge`, `Modal`, `Skeleton`, `EmptyState` | tokens |
| `components/` (compostos) | Combinações reutilizáveis de primitivos | `SearchField`, `UserMenu`, `ConfirmDialog`, `DataTable`, `FormField` | `ui/` |
| `features/<domínio>/` | Peças com regra de negócio | `ProjectCard`, `InvoiceRow`, `CheckoutSummary` | `ui/`, `components/`, dados do domínio |
| `screens/` ou `app/` (páginas) | Monta a tela, busca dados, decide estados | `ProjectsPage` | tudo acima |

A dependência só desce. Um primitivo nunca importa um componente de feature.

Estrutura sugerida (adapte ao framework):

```
src/
  styles/tokens.(css|ts)
  ui/
    Button/
      Button.tsx
      Button.test.tsx
      Button.stories.tsx   (opcional)
      index.ts
  components/
  features/projects/
    ProjectCard.tsx
    ProjectList.tsx
  screens/ProjectsPage.tsx
```

## Regras

1. **Se aparece duas vezes, vira componente.** Se aparece uma vez mas tem estados próprios (hover, loading, aberto/fechado), também vira componente.
2. **Um componente, uma responsabilidade, um arquivo.** Mais de ~150 linhas ou mais de 3 níveis de JSX/markup aninhado → quebre.
3. **Layout também é componente.** Use `Stack`/`Row`/`Grid`/`Container` com props de espaço (`gap="md"`) em vez de `div` com margens soltas. Espaçamento entre irmãos é responsabilidade do pai (`gap`), não de `margin` no filho.
4. **Variantes por props, não por cópia.** `<Button variant="primary|secondary|ghost|danger" size="sm|md|lg" loading icon>`. Em React use `cva`/`tailwind-variants`; em Flutter/Compose, parâmetros com enum; em SwiftUI, `ButtonStyle`.
5. **Todos os estados ficam dentro do componente.** O `Button` sabe desenhar hover, pressed, focus, disabled e loading. A tela só passa `loading={isSaving}`.
6. **Nada de estilo literal fora de `ui/`.** Telas e features não definem cor, sombra ou duração; usam tokens ou variantes.
7. **Composição em vez de prop gigante.** Prefira `<Card><Card.Header/><Card.Body/></Card>` ou `children`/slots a `<Card title subtitle footer headerIcon footerAlign ...>`.
8. **Componentes de apresentação não buscam dados.** Recebem props e emitem eventos (`onSelect`, `onDelete`). Buscar dados e decidir loading/erro/vazio é papel da tela ou de um hook (`useProjects`).
9. **Nomes dizem o que é, não como parece.** `ProjectCard`, não `BlueBox`. Props de evento começam com `on`, booleanos com `is`/`has` ou adjetivo (`disabled`, `loading`).
10. **API acessível por padrão.** O primitivo já aplica role, label, foco e teclado. Quem usa não precisa lembrar.
11. **Reaproveite antes de criar.** Antes de fazer um componente novo, procure em `ui/` e `components/`. Se a base for shadcn/Radix/React Aria, embrulhe ela em vez de recriar do zero.

## Ao entregar uma tela

Mostre a árvore de componentes em poucas linhas, por exemplo:

```
ProjectsPage
├─ PageHeader (title, actions: Button "Novo projeto")
├─ Toolbar
│  ├─ SearchField
│  └─ FilterMenu
└─ ProjectList  (loading → Skeleton×6 | vazio → EmptyState | erro → ErrorState)
   └─ ProjectCard × n
      ├─ Avatar, Text, Badge
      └─ IconButton (menu) → DropdownMenu
```

Assim o usuário entende a estrutura sem ler o código.
