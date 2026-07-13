import { prisma } from '../../../../prisma/prisma.js'
import { UserNotFoundError } from '../../../errors/user.js' // Remova a linha antiga e mude para esta:
import { Prisma } from '@prisma/client'
export class PostgresDeleteUserRepository {
    async execute(userId) {
        try {
            return await prisma.user.delete({
                where: {
                    id: userId,
                },
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                const errorCode = error.code
                if (errorCode === 'P2025') {
                    throw new UserNotFoundError(userId)
                }
            }
            throw error
        }
    }
}
