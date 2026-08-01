-- Clean orphaned sessions, OAuth accounts, and audit logs
DELETE FROM "Session" WHERE "userId" NOT IN (SELECT id FROM "User");
DELETE FROM "OAuthAccount" WHERE "userId" NOT IN (SELECT id FROM "User");
DELETE FROM "AuditLog" WHERE "userId" NOT IN (SELECT id FROM "User") AND "userId" IS NOT NULL;

SELECT 'CLIENT USER COUNT' as metric, COUNT(id) as count FROM "User" WHERE portal = 'CLIENT';
SELECT 'TOTAL REMAINING USERS' as metric, COUNT(id) as count FROM "User";
