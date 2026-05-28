import { prisma } from '../../../../prisma/prisma.js'
export class PostgresDeleteUserRepository {
    async execute(userId) {
        try {
            await prisma.user.delete({
                where: {
                    id: userId,
                },
            })
        } catch (error) {
            console.error('Error deleting user:', error)
            return null
        }
    }
}
