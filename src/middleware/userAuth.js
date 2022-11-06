const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'community1251'
}

module.exports = new JwtStrategy(opts, async function async(jwtPayload, done) {
  const user = await prisma.user.findUnique({
    where: { id: jwtPayload.id }
  })
  console.log(user)
  if (user) {
    return done(null, user)
  } else {
    return done(null, false)
  }
})
