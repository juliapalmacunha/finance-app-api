import { user as fakeUser } from '../../../tests'
import { prisma } from '../../../../prisma/prisma'
import { PostgresGetUserBalanceRepository } from './get-user-balance'
import { faker } from '@faker-js/faker'
import { TransactionType } from '@prisma/client'

describe('PostgresGetUserBalanceRepository', () => {
    it('should get user balance on db', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        const user = await prisma.user.create({ data: fakeUser })
        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: TransactionType.EARNING,
                    amount: 5000,
                },
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: TransactionType.EARNING,
                    amount: 5000,
                },
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: TransactionType.EARNING,
                    amount: 5000,
                },
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: TransactionType.EXPENSE,
                    amount: 1000,
                },
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: TransactionType.EXPENSE,
                    amount: 1000,
                },
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: TransactionType.INVESTMENT,
                    amount: 3000,
                },
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: TransactionType.INVESTMENT,
                    amount: 3000,
                },
            ],
        })

        const result = await sut.execute(user.id)

        expect(result.earnings.toString()).toBe('15000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('6000')
        expect(result.balance.toString()).toBe('7000')
    })

    it('should call prisma transaction aggregate three times with correct parameters', async () => {
        const sut = new PostgresGetUserBalanceRepository()
        jest.spyOn(prisma.transaction, 'aggregate')

        await sut.execute(fakeUser.id)

        expect(prisma.transaction.aggregate).toHaveBeenCalledTimes(3)
        expect(prisma.transaction.aggregate).toHaveBeenNthCalledWith(1, {
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EXPENSE,
            },
            _sum: {
                amount: true,
            },
        })
        expect(prisma.transaction.aggregate).toHaveBeenNthCalledWith(2, {
            where: {
                user_id: fakeUser.id,
                type: TransactionType.EARNING,
            },
            _sum: {
                amount: true,
            },
        })
        expect(prisma.transaction.aggregate).toHaveBeenNthCalledWith(3, {
            where: {
                user_id: fakeUser.id,
                type: TransactionType.INVESTMENT,
            },
            _sum: {
                amount: true,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        //arrange
        const sut = new PostgresGetUserBalanceRepository()
        jest.spyOn(prisma.transaction, 'aggregate').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const promise = sut.execute(fakeUser.id)

        //assert
        await expect(promise).rejects.toThrow()
    })
})
