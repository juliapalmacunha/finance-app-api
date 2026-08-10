import { PostgresUpdateTransactionRepository } from './update-transaction.js'
import { transaction, user } from '../../../tests/index.js'
import { prisma } from '../../../../prisma/prisma.js'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import { TransactionNotFoundError } from '../../../errors/index.js'

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

    it('should call Prisma with correct params', async () => {
        //arrange
        const sut = new PostgresUpdateTransactionRepository()
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'update')

        //act
        await sut.execute(transaction.id, { ...transaction, user_id: user.id })

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
            data: {
                ...transaction,
                user_id: user.id,
            },
        })
    })

    it('should throw if prisma throws', async () => {
        //arrange
        const sut = new PostgresUpdateTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'update')
            .mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(transaction.id, {
            ...transaction,
            user_id: user.id,
        })

        //assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if transaction is not found', async () => {
        //arrange
        const sut = new PostgresUpdateTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'update')
            .mockRejectedValueOnce(
                new Prisma.PrismaClientKnownRequestError('', {
                    code: 'P2025',
                }),
            )

        //act
        const promise = sut.execute(transaction.id, transaction)

        //assert
        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        )
    })
})
