import { faker } from '@faker-js/faker'
import { GetUserByIdUseCase } from './get-user-by-id'

describe('GetUserByIdUseCase', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserByIdUseCase(getUserByIdRepository)

        return {
            sut,
            getUserByIdRepository,
        }
    }

    it('should get user by id successfully', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(faker.string.uuid())

        //assert
        expect(result).toBeTruthy()
        expect(result).toEqual(user)
    })

    it('should call getUserByIdRepository with correct params', async () => {
        //arrange
        const { sut } = makeSut()
        const executeSpy = jest.spyOn(sut.getUserByIdRepository, 'execute')
        const userId = faker.string.uuid()

        //act
        await sut.execute(userId)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        //arrange
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const result = sut.execute(faker.string.uuid())

        //assert
        await expect(result).rejects.toThrow()
    })
})
