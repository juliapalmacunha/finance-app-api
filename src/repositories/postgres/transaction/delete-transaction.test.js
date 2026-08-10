import { PostgresDeleteTransactionRepository } from './delete-transaction.js'
import { TransactionNotFoundError } from '../../../errors/index.js'
import { transaction, user } from '../../../tests/index.js'
import { prisma } from '../../../../prisma/prisma.js'
import { PrismaClientKnownRequestError } from '@prisma/client'
import dayjs from 'dayjs'

describe('PostgresDeleteTransactionRepository', () => {
    it('should delete a transaction on db', async () => {
        //arrange
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: {
                ...transaction,
                user_id: user.id,
            },
        })
        const sut = new PostgresDeleteTransactionRepository()

        //act
        const result = await sut.execute(transaction.id)

        //assert
        expect(result).not.toBeNull()
        expect(result.user_id).toBe(user.id)
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
        expect(result.name).toBe(transaction.name)
        expect(result.type).toBe(transaction.type)
        expect(String(result.amount)).toBe(String(transaction.amount))
    })

    it('should call Prisma delete method with correct values', async () => {
        //arrange
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: {
                ...transaction,
                user_id: user.id,
            },
        })
        const sut = new PostgresDeleteTransactionRepository()
        const prismaeSpy = import.meta.jest.spyOn(prisma.transaction, 'delete')

        //act
        await sut.execute(transaction.id)

        //assert
        expect(prismaeSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        //arrange
        const sut = new PostgresDeleteTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'delete')
            .mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(transaction.id)

        //assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if transaction is not found', async () => {
        //arrange
        const sut = new PostgresDeleteTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'delete')
            .mockRejectedValueOnce(
                new PrismaClientKnownRequestError('', {
                    code: 'P2025',
                }),
            )

        //act
        const promise = sut.execute(transaction.id)

        //assert
        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        )
    })
})
