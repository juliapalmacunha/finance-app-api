import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user'

describe('DeleteUserUseCase', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()
        const sut = new DeleteUserUseCase(deleteUserRepository)

        return {
            sut,
            deleteUserRepository,
        }
    }

    it('should successfully delete a user', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(faker.string.uuid())

        //assert
        expect(result).toEqual(user)
    })

    it('should call deleteUserRepository with correct params', async () => {
        //arrange
        const { sut, deleteUserRepository } = makeSut()
        const executeSpy = jest.spyOn(deleteUserRepository, 'execute')
        const userId = faker.string.uuid()

        //act
        await sut.execute(userId)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if deleteUserRepository throws', async () => {
        //arrange
        const { sut, deleteUserRepository } = makeSut()
        jest.spyOn(deleteUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const result = sut.execute(faker.string.uuid())

        //assert
        await expect(result).rejects.toThrow()
    })
})
