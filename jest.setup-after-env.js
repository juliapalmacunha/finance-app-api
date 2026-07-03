import { prisma } from './prisma/prisma'

// Este bloco roda AUTOMATICAMENTE antes de cada arquivo de teste começar
beforeEach(async () => {
    console.log('Limpando o banco de dados antes de cada teste...')
    await prisma.user.deleteMany({})
    await prisma.transaction.deleteMany({})
})
