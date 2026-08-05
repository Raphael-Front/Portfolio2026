# Portfólio · Raphael Martins

Portfólio pessoal — desenvolvedor full-stack focado em aplicações web para a construção civil.
Apresenta os sistemas **Audit BIM**, **Edifica** e **Databook**.

> Site estático (sem banco de dados). As telas dos projetos são **mockups com dados fictícios** — nenhum dado interno real é exposto.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- CSS próprio com tokens (tema claro/escuro, sem framework de UI)
- Deploy na **Vercel**

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Sobe o build |

## Estrutura

```
app/
├─ layout.tsx      metadata, tema (claro/escuro), estilos globais
├─ page.tsx        página única (hero, sobre, stack, projetos, contato)
└─ globals.css     design system (tokens + componentes)
components/
└─ ClientEnhancements.tsx   toggle de tema + reveal on scroll
public/
└─ perfil.jpg      foto do hero
```

## Personalizar

- **Foto:** substitua `public/perfil.jpg`. A imagem é exibida espelhada horizontalmente (classe `flip` em `app/page.tsx`) para corrigir selfies de espelho — remova a classe se a sua foto já estiver na orientação correta.
- **Conteúdo dos projetos:** array `projetos` no topo de `app/page.tsx`.
- **Contatos:** seção `#contato` em `app/page.tsx`.

---

_© 2026 Raphael Martins._
