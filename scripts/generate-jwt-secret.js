#!/usr/bin/env node

/**
 * Generate a secure JWT secret
 * Usage: node scripts/generate-jwt-secret.js
 */

const crypto = require('crypto');

const secret = crypto.randomBytes(64).toString('base64');

console.log('🔑 Generated JWT Secret:');
console.log('========================');
console.log(secret);
console.log('========================');
console.log('');
console.log('Add this to your .env file:');
console.log(`JWT_SECRET=${secret}`);
console.log('');
console.log('⚠️  Keep this secret safe and never commit it to version control!');
