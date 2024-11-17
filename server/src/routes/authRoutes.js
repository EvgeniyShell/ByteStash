const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, TOKEN_EXPIRY, ALLOW_NEW_ACCOUNTS } = require('../middleware/auth');
const userService = require('../services/userService');

const router = express.Router();

router.get('/config', (req, res) => {
  res.json({ 
    authRequired: true,
    allowNewAccounts: ALLOW_NEW_ACCOUNTS
  });
});

router.post('/register', async (req, res) => {
  if (!ALLOW_NEW_ACCOUNTS) {
    return res.status(403).json({ error: 'New account registration is disabled' });
  }

  try {
    const { username, password } = req.body;
    const user = await userService.createUser(username, password);
    
    const token = jwt.sign({ 
      id: user.id,
      username: user.username 
    }, JWT_SECRET, { 
      expiresIn: TOKEN_EXPIRY 
    });

    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userService.validateUser(username, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ 
      id: user.id,
      username: user.username 
    }, JWT_SECRET, { 
      expiresIn: TOKEN_EXPIRY 
    });

    res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

router.get('/verify', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userService.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ valid: false });
    }

    res.status(200).json({ 
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at
      }
    });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;