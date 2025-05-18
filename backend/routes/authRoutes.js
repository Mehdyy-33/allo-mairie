const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

const SECRET = process.env.JWT_SECRET || 'citoyen-secret'

// Inscription
router.post('/register', async (req, res) => {
  const { email, password } = req.body
  const hashed = await bcrypt.hash(password, 10)
  try {
    const user = await prisma.user.create({
      data: { email, password: hashed },
    })
    res.json({ id: user.id, email: user.email })
  } catch (err) {
    res.status(400).json({ error: 'Utilisateur déjà existant' })
  }
})

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Mot de passe invalide' })

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' })
  res.json({ token })
})

module.exports = router
