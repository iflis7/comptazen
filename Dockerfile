# ---- deps: install dependencies with a reproducible, cached layer ----
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ---- dev: hot-reloading dev server, run via `docker compose --profile dev up dev` ----
# Source is bind-mounted in at runtime (see docker-compose.yml), so this
# stage only needs deps baked in — edits on the host show up in the
# container immediately and Next's dev server hot-reloads as usual.
FROM deps AS dev
WORKDIR /app
COPY . .
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---- builder: produce the standalone production build ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# NOTE: this build fetches Archivo / IBM Plex from Google Fonts at build
# time (next/font/google). If you're building somewhere without outbound
# access to fonts.googleapis.com, the build will fail — see README.
RUN npm run build

# ---- runner: minimal runtime image, non-root ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
