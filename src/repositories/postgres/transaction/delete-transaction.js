import { prisma } from '../../../../prisma/prisma.js'
import { TransactionNotFoundError } from '../../../errors/index.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        try {
            return await prisma.transaction.delete({
                where: {
                    id: transactionId,
                },
            })
        } catch (error) {
            if (error instanceof prisma.PrismaClientKnownRequestError) {
                const errorCode = error.code
                if (errorCode === 'P2025') {
                    throw new TransactionNotFoundError(transactionId)
                }
            }
            throw error
        }
    }
}
