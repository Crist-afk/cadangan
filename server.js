import express from 'express';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const MYSQL_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gitcontrib',
  port: Number(process.env.DB_PORT) || 3306
};

let dbPool = null;
let isUsingMySQL = false;

const LOCAL_DB_FILE = path.join(process.cwd(), 'gitcontrib_db.json');

const DEFAULT_USERS_SEED = [
  {
    id: 'usr-dosen-1',
    name: 'Dr. Hendra Wijaya, M.T.',
    email: 'dosen@gitcontrib.ac.id',
    password_hash: 'dosen123',
    role: 'dosen',
    status: 'active',
    company: 'Departemen Teknik Informatika',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
    provider: 'email'
  },
  {
    id: 'usr-admin-1',
    name: 'Prof. Dr. Ir. Admin System',
    email: 'admin@gitcontrib.ac.id',
    password_hash: 'admin123',
    role: 'admin',
    status: 'active',
    company: 'GitContrib System Management',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
    provider: 'email'
  },
  {
    id: 'usr-dosen-2',
    name: 'Siti Rahmawati, S.Kom., M.Cs.',
    email: 'siti.rahma@university.ac.id',
    password_hash: 'dosen123',
    role: 'dosen',
    status: 'active',
    company: 'Fakultas Ilmu Komputer',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80',
    provider: 'email'
  }
];

function getLocalUsers() {
  try {
    if (!fs.existsSync(LOCAL_DB_FILE)) {
      fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(DEFAULT_USERS_SEED, null, 2));
      return DEFAULT_USERS_SEED;
    }
    return JSON.parse(fs.readFileSync(LOCAL_DB_FILE, 'utf-8'));
  } catch {
    return DEFAULT_USERS_SEED;
  }
}

function saveLocalUsers(users) {
  try {
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Failed to write local DB:', err);
  }
}

async function initMySQL() {
  try {
    const tempConn = await mysql.createConnection({
      host: MYSQL_CONFIG.host,
      user: MYSQL_CONFIG.user,
      password: MYSQL_CONFIG.password,
      port: MYSQL_CONFIG.port
    });
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_CONFIG.database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await tempConn.end();

    dbPool = mysql.createPool(MYSQL_CONFIG);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` VARCHAR(64) NOT NULL PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL UNIQUE,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`role\` ENUM('dosen', 'admin') NOT NULL DEFAULT 'dosen',
        \`status\` ENUM('active', 'disabled', 'pending') NOT NULL DEFAULT 'active',
        \`company\` VARCHAR(255) DEFAULT 'Departemen Akademik',
        \`avatar_url\` TEXT DEFAULT NULL,
        \`provider\` VARCHAR(32) DEFAULT 'email',
        \`registered_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`last_login\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    for (const u of DEFAULT_USERS_SEED) {
      await dbPool.query(`
        INSERT INTO \`users\` (\`id\`, \`name\`, \`email\`, \`password_hash\`, \`role\`, \`status\`, \`company\`, \`avatar_url\`, \`provider\`, \`registered_at\`, \`last_login\`)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`);
      `, [u.id, u.name, u.email, u.password_hash, u.role, u.status, u.company, u.avatar_url, u.provider]);
    }

    isUsingMySQL = true;
    console.log('[GitContrib] ? MySQL XAMPP connected ï¿½ database: gitcontrib');
  } catch (err) {
    console.warn(`[GitContrib] ?? MySQL not available (${err.message}). Using local JSON fallback.`);
    isUsingMySQL = false;
  }
}

export async function createServer() {
  const app = express();
  app.use(express.json());

  await initMySQL();

  // GET /api/status
  app.get('/api/status', (req, res) => {
    res.json({
      status: 'online',
      databaseEngine: isUsingMySQL ? 'MySQL / MariaDB (XAMPP)' : 'Local JSON (gitcontrib_db.json)',
      database: MYSQL_CONFIG.database
    });
  });

  // POST /api/auth/login
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      return res.status(400).json({ success: false, message: 'Email dan kata sandi wajib diisi.' });
    }

    try {
      let foundUser = null;
      if (isUsingMySQL && dbPool) {
        const [rows] = await dbPool.query('SELECT * FROM users WHERE LOWER(email) = ?', [cleanEmail]);
        if (rows.length > 0) foundUser = rows[0];
      } else {
        foundUser = getLocalUsers().find(u => u.email.toLowerCase() === cleanEmail);
      }

      if (!foundUser) return res.status(404).json({ success: false, code: 'account_not_found', message: 'Akun tidak ditemukan.' });
      if (foundUser.status === 'disabled') return res.status(403).json({ success: false, code: 'account_disabled', message: 'Akun Anda telah dinonaktifkan.' });
      if (foundUser.password_hash !== cleanPass) return res.status(401).json({ success: false, code: 'incorrect_password', message: 'Kata sandi salah.' });

      if (isUsingMySQL && dbPool) {
        await dbPool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [foundUser.id]);
      }

      return res.json({
        success: true,
        user: {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          status: foundUser.status,
          company: foundUser.company,
          avatarUrl: foundUser.avatar_url || foundUser.avatarUrl,
          provider: foundUser.provider || 'email',
          lastLogin: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Kesalahan sistem.' });
    }
  });

  // POST /api/auth/register
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanName || !cleanEmail || !cleanPass) {
      return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi.' });
    }

    try {
      const newUser = {
        id: `usr-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        password_hash: cleanPass,
        role: 'dosen',
        status: 'active',
        company: 'Departemen Akademik',
        avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanEmail}`,
        provider: 'email'
      };

      if (isUsingMySQL && dbPool) {
        const [existing] = await dbPool.query('SELECT id FROM users WHERE LOWER(email) = ?', [cleanEmail]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
        await dbPool.query(
          `INSERT INTO users (id, name, email, password_hash, role, status, company, avatar_url, provider, registered_at, last_login) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [newUser.id, newUser.name, newUser.email, newUser.password_hash, newUser.role, newUser.status, newUser.company, newUser.avatar_url, newUser.provider]
        );
      } else {
        const users = getLocalUsers();
        if (users.some(u => u.email.toLowerCase() === cleanEmail)) return res.status(400).json({ success: false, message: 'Email sudah terdaftar.' });
        users.push(newUser);
        saveLocalUsers(users);
      }

      return res.json({ success: true, message: 'Akun berhasil didaftarkan ke database.' });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ success: false, message: 'Gagal membuat akun.' });
    }
  });

  // GET /api/users
  app.get('/api/users', async (req, res) => {
    try {
      if (isUsingMySQL && dbPool) {
        const [rows] = await dbPool.query('SELECT id, name, email, role, status, company, avatar_url AS avatarUrl, registered_at AS registeredAt, last_login AS lastLogin FROM users ORDER BY registered_at DESC');
        return res.json({ success: true, users: rows });
      }
      const users = getLocalUsers().map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, status: u.status, company: u.company, avatarUrl: u.avatar_url, registeredAt: u.registered_at, lastLogin: u.last_login }));
      return res.json({ success: true, users });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Gagal mengambil data.' });
    }
  });

  // PUT /api/users/:id/status
  app.put('/api/users/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'disabled', 'pending'].includes(status)) return res.status(400).json({ success: false, message: 'Status tidak valid.' });
    try {
      if (isUsingMySQL && dbPool) await dbPool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
      else { const users = getLocalUsers(); saveLocalUsers(users.map(u => u.id === id ? { ...u, status } : u)); }
      return res.json({ success: true, message: `Status diperbarui menjadi ${status}.` });
    } catch { return res.status(500).json({ success: false, message: 'Gagal memperbarui status.' }); }
  });

  // PUT /api/users/:id/role
  app.put('/api/users/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!['dosen', 'admin'].includes(role)) return res.status(400).json({ success: false, message: 'Role tidak valid.' });
    try {
      if (isUsingMySQL && dbPool) await dbPool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
      else { const users = getLocalUsers(); saveLocalUsers(users.map(u => u.id === id ? { ...u, role } : u)); }
      return res.json({ success: true, message: `Role diperbarui menjadi ${role}.` });
    } catch { return res.status(500).json({ success: false, message: 'Gagal memperbarui role.' }); }
  });

  // DELETE /api/users/:id
  app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      if (isUsingMySQL && dbPool) await dbPool.query('DELETE FROM users WHERE id = ?', [id]);
      else { const users = getLocalUsers(); saveLocalUsers(users.filter(u => u.id !== id)); }
      return res.json({ success: true, message: 'Akun berhasil dihapus.' });
    } catch { return res.status(500).json({ success: false, message: 'Gagal menghapus akun.' }); }
  });

  return app;
}

// Auto-start when run directly
const isMain = process.argv[1] && process.argv[1].endsWith('server.js');
if (isMain) {
  const PORT = process.env.PORT || 5000;
  createServer().then(app => {
    app.listen(PORT, () => console.log('[GitContrib] Backend running on http://localhost:' + PORT));
  });
}
