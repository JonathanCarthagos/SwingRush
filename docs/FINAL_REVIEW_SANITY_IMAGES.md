# Revisão final — Sanity vs `public/images` (adiada)

> Guardado durante a fase de **ajustes de estilo**. Retomar no fechamento do site / handoff editorial.

## Contexto

Havia ~24 JPEGs modificados localmente (recompressão) em `public/images/` **fora** do último commit de UI. Pergunta: essas imagens não deveriam estar no Sanity?

## Resposta curta

**Conteúdo editorial → Sanity.** Arquivos em `public/images/` hoje são **fallback**, **heroes ainda hardcoded** ou **assets de build** (OG, etc.).

## O que o schema já cobre

| Área | Studio | Exemplos locais equivalentes |
| --- | --- | --- |
| Home | `homePage` (`videoHero`, `homeStory`) | posters hero, `clubs/*`, `timed-race`, `singles-or-teams` |
| How It Works | `howItWorksPage` + `howItWorksItem` | `how-it-works/*`, `how-it-works-arena.jpg` |
| Locations | `location`, `locationsPage.locationHero` | `locations/new-york/*`, heroes de cidade |
| Challenges (lista) | documentos `challenge` | imagens por desafio |

Runtime: `lib/cms/*` prefere URLs `cdn.sanity.io`; se faltar dado, cai em `data/*.ts` → `/images/...`.

## Lacunas atuais (código)

- **`/challenges`**: `PageHero` usa paths fixos; `challengesPage` **não** tem campo de hero no schema.
- **`/how-it-works`** e **`/locations` (índice)**: conteúdo via CMS, mas **background do `PageHero`** ainda é JPEG estático (How It Works tem `videoHero` no schema, não ligado ao hero visual da página).
- **Home**: mobile hero ainda vem só do fallback (`mobilePosterSrc` / vídeos em `data/home.ts`) mesmo com CMS parcial.
- **Vídeos**: podem estar no Sanity (`file` em `videoHero`) ou em `public/videos/` — padrão misto.

## Política do repo (AGENTS)

- Live/visual editing global **não** no `layout`; CMS runtime focado em **locations** (+ studio). Home já **lê** Sanity, mas operação ainda híbrida.
- Não commitar recompressões locais de JPEG **a menos** que a intenção seja atualizar fallbacks estáticos de propósito.

## Checklist para a revisão final

1. Auditar dataset (produção): o que está publicado vs. o que o site ainda serve de `public/images/`.
2. Decidir destino dos heroes de índice (Challenges, Locations, How It Works): schema + query + `PageHero` vs. manter estático documentado.
3. Migrar assets editoriais restantes para Sanity; manter em repo só fallbacks mínimos + OG/social.
4. Alinhar com cliente: quem troca imagem (Studio) vs. deploy (dev).
5. Opcional: documentar `scripts/compress-images.mjs` — compressão local **antes** do upload no Studio, não no git.

## Referências no código

- Fallback Home: `data/home.ts`, adaptador `lib/cms/home.ts`
- Heroes hardcoded: `app/(site)/challenges/page.tsx`, `how-it-works/page.tsx`, `locations/page.tsx`
- Handoff Challenges (fallback CMS): `docs/CHALLENGES_DESKTOP_HANDOFF.md`
