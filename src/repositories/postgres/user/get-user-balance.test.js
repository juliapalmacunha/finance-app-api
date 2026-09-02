import { user as fakeUser } from '../../../tests/index.js'
import { prisma } from '../../../../prisma/prisma.js'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

describe('PostgresGetUserBalanceRepository', () => {
    const from = '2026-01-01'
    const to = '2026-12-31'

    it('should get user balance on db', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        //cria o usuario
        const user = await prisma.user.create({ data: fakeUser })
        //cria as transacoes do usuario
        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(3),
                    date: new Date(from),
                    user_id: user.id,
                    type: TransactionType.EARNING,
                    amount: 5000,
                },
                {
                    name: faker.string.sample(3),
                    date: new Date(from),
                    user_id: user.id,
                    type: TransactionType.EARNING,
                    amount: 5000,
                },
                {
                    name: faker.string.sample(3),
                    date: new Date(from),
                    user_id: user.id,
                    type: TransactionType.EARNING,
                    amount: 5000,
                },
                {
                    name: faker.string.sample(3),
                    date: new Date(from),
                    user_id: user.id,
                    type: TransactionType.EXPENSE,
                    amount: 1000,
                },
                {
                    name: faker.string.sample(3),
                    date: new Date(from),
                    user_id: user.id,
                    type: TransactionType.EXPENSE,
                    amount: 1000,
                },
                {
                    name: faker.string.sample(3),
                    date: new Date(from),
                    user_id: user.id,
                    type: TransactionType.INVESTMENT,
                    amount: 3000,
                },
                {
                    name: faker.string.sample(3),
                    date: new Date(to),
                    user_id: user.id,
                    type: TransactionType.INVESTMENT,
                    amount: 3000,
                },
            ],
        })

        const result = await sut.execute(user.id, from, to)

        expect(result.earnings.toString()).toBe('15000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('6000')
        expect(result.balance.toString()).toBe('7000')
    })

    it('should call prisma transaction aggregate three times with correct parameters', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        import.meta.jest.spyOn(prisma.transaction, 'aggregate')

        await sut.execute(fakeUser.id, from, to)

        expect(prisma.transaction.aggregate).toHaveBeenCalledTimes(3)
        expect(prisma.transaction.aggregate).toHaveBeenNthCalledWith(1, {
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EXPENSE,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            _sum: {
                amount: true,
            },
        })
        expect(prisma.transaction.aggregate).toHaveBeenNthCalledWith(2, {
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EARNING,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            _sum: {
                amount: true,
            },
        })
        expect(prisma.transaction.aggregate).toHaveBeenNthCalledWith(3, {
            where: {
                user_id: fakeUser.id,
                type: TransactionType.INVESTMENT,
                date: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
            },
            _sum: {
                amount: true,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        //arrange
        const sut = new PostgresGetUserBalanceRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'aggregate')
            .mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute(fakeUser.id, from, to)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
