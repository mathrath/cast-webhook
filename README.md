# cast-webhook

Call a webhook when a cast device is casted to.

# Why would anyone need this?

I use this automatically switch the input of my audio receiver (using ifttt and harmony) whenever I start casting to a device connected to it.

# Getting Started

## Configuration

cast-webhook can be configured by command line argument or by environment variable (with prefix `CAST_WEBHOOK_`).

| Command Line | Environment Variable | Description                           |
|--------------|----------------------|---------------------------------------|
| --host, -h   | CAST_WEBHOOK_HOST    | URL of cast device to watch           |
| --start, -s  | CAST_WEBHOOK_START   | Webhook to call when a session starts |
| --end, -e    | CAST_WEBHOOK_END     | Webhook to call when a session ends   |

## Running with Docker

A docker image can be found [here](https://hub.docker.com/r/mathrath/cast-webhook). You can run it like this:

```
docker run --rm -e CAST_WEBHOOK_HOST=<cast-device-url> -e CAST_WEBHOOK_START=<webhook-url> mathrath/cast-webhook
```

### With docker-compose

```
version: '3.7'

services:
  cast-webhook:
    image: mathrath/cast-webhook
    environment:
      - CAST_WEBHOOK_HOST=<cast-device-url>
      - CAST_WEBHOOK_START=<webhook-url>
```

## Running it manually

Clone the repo and run:

```bash
npm install
npm start -- --host <cast-device-url> --start <webhook-url>
```
