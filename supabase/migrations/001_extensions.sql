-- Migration 001: Extensions
-- Purpose: Enable PostgreSQL extensions required for UUID generation, crypto, full-text search, and string matching.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
