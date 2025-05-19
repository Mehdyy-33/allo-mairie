const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const passport = require('passport')
const authenticateToken = require('../middlewares/authenticateToken')

const router = express.Router()
const prisma = new PrismaClient()

const SECRET = process.env.JWT_SECRET || 'citoyen-secret'

router.post('/register', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' })
  }

  try {
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashed },
    })
    res.status(201).json({ id: user.id, email: user.email })
  } catch (err) {
    if (err.code === 'P2002') {
      // Erreur Prisma pour doublon (email déjà utilisé)
      res.status(400).json({ error: 'Email déjà utilisé.' })
    } else {
      console.error(err)
      res.status(500).json({ error: 'Erreur serveur. Réessayez plus tard.' })
    }
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

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true } // ⬅ pas de mot de passe ici
    })

    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Google
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get('/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: '/login',
}), (req, res) => {
res.redirect(`http://localhost:5173/formulaire?token=${req.user.token}`)
})



module.exports = router
