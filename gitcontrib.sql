-- ============================================================
-- GitContrib - MySQL / MariaDB Database Schema untuk XAMPP
-- Import file ini melalui phpMyAdmin (http://localhost/phpmyadmin)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `gitcontrib` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gitcontrib`;

-- ------------------------------------------------------------
-- 1. Tabel Users (Otentikasi & Manajemen Akun Dosen/Admin)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('dosen', 'admin') NOT NULL DEFAULT 'dosen',
  `status` ENUM('active', 'disabled', 'pending') NOT NULL DEFAULT 'active',
  `company` VARCHAR(255) DEFAULT 'Departemen Akademik',
  `avatar_url` TEXT DEFAULT NULL,
  `provider` VARCHAR(32) DEFAULT 'email',
  `registered_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_login` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Tabel Audit Logs (Catatan Aktivitas Sistem)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_email` VARCHAR(255) NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `role` ENUM('dosen', 'admin') NOT NULL,
  `activity` VARCHAR(255) NOT NULL,
  `target` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(64) DEFAULT '127.0.0.1',
  `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. Tabel System Configuration
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_config` (
  `config_key` VARCHAR(64) NOT NULL PRIMARY KEY,
  `config_value` TEXT NOT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- SEED DATA AWAL (Akun Bawaan Dosen & Admin)
-- ------------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `status`, `company`, `avatar_url`, `provider`, `registered_at`, `last_login`) VALUES
('usr-dosen-1', 'Dr. Hendra Wijaya, M.T.', 'dosen@gitcontrib.ac.id', 'dosen123', 'dosen', 'active', 'Departemen Teknik Informatika', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80', 'email', '2025-01-15 08:00:00', NOW()),
('usr-admin-1', 'Prof. Dr. Ir. Admin System', 'admin@gitcontrib.ac.id', 'admin123', 'admin', 'active', 'GitContrib System Management', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80', 'email', '2025-01-01 08:00:00', NOW()),
('usr-dosen-2', 'Siti Rahmawati, S.Kom., M.Cs.', 'siti.rahma@university.ac.id', 'dosen123', 'dosen', 'active', 'Fakultas Ilmu Komputer', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80', 'email', '2025-03-01 11:20:00', NOW())
ON DUPLICATE KEY UPDATE `name`=`name`;

-- Insert Initial System Config
INSERT INTO `system_config` (`config_key`, `config_value`) VALUES
('app_name', 'GitContrib - Contributor Pattern Analytics System'),
('maintenance_mode', 'false'),
('max_repository_size_mb', '500')
ON DUPLICATE KEY UPDATE `config_key`=`config_key`;
