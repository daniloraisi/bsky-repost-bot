# BSky Repost Bot

<div align="center">

[![Static Badge](https://img.shields.io/badge/Made%20with%20Deno-000000?style=for-the-badge&logo=deno)](https://deno.com/)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/daniloraisi/bsky-repost-bot/deploy-function.yml?branch=main&style=for-the-badge&logo=bluesky&label=comunidade.dev.br)](https://bsky.app/profile/comunidade.dev.br)

</div>

Esse é o repositório do Bot de Repost para o BlueSky.

## Funcionalidades

|                           | Dev | Beta               | Pronto |
| ------------------------- | --- | ------------------ | ------ |
| Marcar @comunidade.dev.br |     | :heavy_check_mark: |        |
| Repost #bolhatech         |     | :heavy_check_mark: |        |
| Repost #bolhadev          |     | :heavy_check_mark: |        |
| Repost #comunidadedev     |     | :heavy_check_mark: |        |

## Para usar

Mencione `@comunidade.dev.br` ou use as tags `#bolhatech`, `#bolhadev` ou `#comunidadedev`.

## Como o bot funciona?

A cada 15 minutos o bot percorre as notificações da conta @comunidade.dev.br para
dar repost nos posts em que foi marcado.

Também busca pelos posts com a tags acima.

Aplicamos filtros na busca para evitar repost de assuntos polêmicos ou não relacionados
a tecnologia.

## Quer colaborar?

Para executar o bot na sua máquina local é preciso instalar algumas ferramentas:

- [Docker Desktop](https://www.docker.com/products/docker-desktop) ou [Rancher Desktop](https://rancherdesktop.io/)
- [Deno](https://deno.land/)
- [Supabase CLI](https://supabase.io/docs/guides/cli)

Copie o arquivo `.env.example` para `.env` e preencha as variáveis de ambiente.

```bash
cp .env.example .env
```

Execute o ambiente Supabase.

```bash
supabase start
```

Suba o ambiente Upstash.

```bash
docker compose up -d
```

Execute o bot.

```bash
supabase functions serve --no-verify-jwt --env-file .env
```
