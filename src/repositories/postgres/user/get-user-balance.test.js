import { user as fakeUser } from '../../../tests'
import { prisma } from '../../../../prisma/prisma'
import { PostgresGetUserBalanceRepository } from './get-user-balance'
import { faker } from '@faker-js/faker'

describe('GetUserBalanceRepository', () => {
    it('should get user balance on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: 'EARNING',
                    amount: 5000,
                },
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: 'EARNING',
                    amount: 5000,
                },
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: 'EARNING',
                    amount: 5000,
                },
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: 'EXPENSE',
                    amount: 1000,
                },
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: 'EXPENSE',
                    amount: 1000,
                },
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: 'INVESTMENT',
                    amount: 3000,
                },
                {
                    name: faker.string.sample(3),
                    date: faker.date.recent(),
                    user_id: user.id,
                    type: 'INVESTMENT',
                    amount: 3000,
                },
            ],
        })

        const sut = new PostgresGetUserBalanceRepository()

        const result = await sut.execute(user.id)

        expect(result.earnings.toString()).toBe('15000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('6000')
        expect(result.balance.toString()).toBe('7000')
    })
})
