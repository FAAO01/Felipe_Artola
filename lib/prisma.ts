import { PrismaClient } from '@prisma/client'

// Evita instancias múltiples de PrismaClient en desarrollo (Hot Reloading)
declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
