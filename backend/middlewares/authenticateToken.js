const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET || 'citoyen-secret'

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Token manquant' })
  }

jwt.verify(token, SECRET, (err, user) => {
  if (err) return res.status(403).json({ error: 'Token invalide' });
  req.user = user;
  next();
});
}

module.exports = authenticateToken
