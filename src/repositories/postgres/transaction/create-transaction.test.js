import { transaction } from '../../../tests'
import { PostgresCreateTransactionRepository } from './create-transaction'
import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests'
import dayjs from 'dayjs'

describe('PostgresCreateTransactionRepository', () => {
    it('should create a transaction on db', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresCreateTransactionRepository()
        //act
        const result = await sut.execute({ ...transaction, user_id: user.id })

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

    it('should call Prisma with correct params', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresCreateTransactionRepository()
        const prismaSpy = jest.spyOn(prisma.transaction, 'create')

        //act
        await sut.execute({ ...transaction, user_id: user.id })

        //assert
        expect(prismaSpy).toHaveBeenCalledWith({
            data: {
                ...transaction,
                user_id: user.id,
            },
        })
    })
})
