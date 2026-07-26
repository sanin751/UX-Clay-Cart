const User = require('../src/models/User');
const { signAccessToken } = require('../src/utils/token');

async function createUserAndToken(overrides = {}) {
  const user = await User.create({
    name: 'Test User',
    email: `user-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
    password: 'Password123',
    role: 'customer',
    ...overrides,
  });
  return { user, token: signAccessToken(user) };
}

async function createAdminAndToken(overrides = {}) {
  return createUserAndToken({ role: 'admin', ...overrides });
}

module.exports = { createUserAndToken, createAdminAndToken };
