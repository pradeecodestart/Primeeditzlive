@echo off
echo =======================================================
echo 🔧 Antigravity PostProd Pro Maintenance & Optimization
echo =======================================================

echo 1. Clearing build caches (.next, .turbo, .cache, .eslintcache)...
powershell -Command "Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .next, .turbo, .cache, .eslintcache, *.log, *.tsbuildinfo"

echo 2. Running npm dedupe...
call npm dedupe

echo 3. Generating Prisma Client...
call npx prisma generate

echo 4. Running TypeScript type check...
call npx tsc --noEmit

echo =======================================================
echo ✅ Maintenance & Cleanup Completed Successfully!
echo =======================================================
