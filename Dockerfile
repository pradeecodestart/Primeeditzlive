FROM node:20-alpine

# Install libc6-compat and OpenSSL for Prisma engine compatibility
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm install --legacy-peer-deps

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
