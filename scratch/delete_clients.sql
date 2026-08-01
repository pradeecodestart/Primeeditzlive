-- ============================================
-- DELETE CLIENT USERS ONLY - KEEP STRUCTURE & STAFF USERS
-- ============================================

SELECT 'BEFORE DELETION' as status, portal, COUNT(id) as count FROM "User" GROUP BY portal;

-- Delete CLIENT users (cascades to sessions, oauth accounts, audit logs)
DELETE FROM "User" WHERE portal = 'CLIENT';

SELECT 'AFTER DELETION' as status, portal, COUNT(id) as count FROM "User" GROUP BY portal;

-- Show remaining users (STAFF, ADMIN, SUPER_ADMIN)
SELECT email, role, portal, "isEmailVerified", "createdAt" FROM "User" ORDER BY "createdAt" DESC;
