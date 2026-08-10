import { transaction } from '../../../tests/index.js'
import { PostgresCreateTransactionRepository } from './create-transaction.js'
import { prisma } from '../../../../prisma/prisma.js'
import { user as fakeUser } from '../../../tests/index.js'
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
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'create')

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

    it('should throw if prisma throws', async () => {
        //arrange
        const user = await prisma.user.create({ data: fakeUser })
        const sut = new PostgresCreateTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'create')
            .mockRejectedValueOnce(new Error())

        //act
        const promise = sut.execute({ ...transaction, user_id: user.id })

        //assert
        await expect(promise).rejects.toThrow()
    })
})
