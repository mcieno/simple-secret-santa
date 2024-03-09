# Development

This document describes the process for running the application locally.

## Prerequisites

[Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).

You can optionally use [Træfik](https://containo.us/traefik/) for ease of
exposing the site.
Check out [Træfik & Docker](https://doc.traefik.io/traefik/providers/docker/).

## Develop with Docker Compose

Just run:

```shell
docker compose up -d --build
```

Easy peasy.

If you're using Træfik, the site should be available at [`simple-secret-santa.mcieno.internal`](https://simple-secret-santa.mcieno.internal).
Otherwise, simply run `docker compose ps` and find out which host port was
assigned to the `site` service.
