# ---- Stage 1: build ----
# Full dependency set (incl. dev) to generate the Prisma client and build Next.js.
FROM node:26-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY actions ./actions
COPY app ./app
COPY components ./components
COPY data ./data
COPY hooks ./hooks
COPY lib ./lib
COPY prisma ./prisma
COPY public ./public
COPY schemas ./schemas
COPY types ./types
COPY uploads ./uploads
COPY *.ts ./
COPY *.json ./
COPY *.mjs ./

RUN npx prisma generate
RUN npm run build

# ---- Stage 2: production dependencies ----
# Dev dependencies (vitest, playwright, ts-node, ...) are never installed here.
# The prisma CLI is a regular dependency so `prisma migrate deploy` works from the
# final image at the exact version pinned in package-lock.json.
FROM node:26-alpine AS prod-deps

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# npm auto-installs these as optional peers of next/tailwindcss; the runtime
# doesn't use them, and they drag the test framework back into the image.
RUN rm -rf node_modules/@playwright node_modules/playwright node_modules/playwright-core node_modules/ts-node

# Generate the client against the prod node_modules so it lands in
# node_modules/.prisma and matches the runtime's engine/platform.
COPY prisma ./prisma
RUN npx prisma generate

# ---- Stage 3: runtime ----
FROM node:26-alpine AS runner

# Prisma's query/migration engines need openssl at runtime
RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/uploads ./uploads
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

CMD ["npm", "start"]
