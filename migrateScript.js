import { PrismaClient } from '@prisma/client'

require('dotenv').config({ path: '.env.migration' })

const prisma = new PrismaClient()

async function migrateToManyToMany () {
  const users = await prisma.user.findMany({
    where: {
      fk_community_id: {
        not: null
      }
    }
  })

  await users.map(async (user) => {
    if (user.fk_community_id) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          communities: {
            connect: { id: user.fk_community_id }
          }
        }
      })
    }
  })

  console.log('Migration complete.')
}

migrateToManyToMany()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
