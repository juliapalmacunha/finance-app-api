import { PostgresUpdateTransactionRepository } from './update-transaction'
import { transaction, user } from '../../../tests'
import { prisma } from '../../../../prisma/prisma'
import { faker } from '@faker-js/faker'

describe('PostgresUpdateTransactionRepository', () => {
    it('should update a transaction on db', async () => {
        //arrange
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()

        const updateTransactionParams = {
            id: transaction.id,
            user_id: user.id,
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        }

        //act
        const result = await sut.execute(
            transaction.id,
            updateTransactionParams,
        )

        //assert
        expect(result.user_id).toBe(updateTransactionParams.user_id)
        expect(result.name).toBe(updateTransactionParams.name)
        expect(result.type).toBe(updateTransactionParams.type)
        expect(String(result.amount)).toBe(
            String(updateTransactionParams.amount),
        )
    })
})
