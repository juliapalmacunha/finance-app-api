import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user'

describe('UpdateUserUseCase', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed-password'
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const updateUserRepository = new UpdateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const sut = new UpdateUserUseCase(
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            updateUserRepository,
            passwordHasherAdapter,
        }
    }

    it('should update user successfully', async () => {
        //arrange
        const { sut } = makeSut()
        const userId = faker.string.uuid()

        //act
        const result = await sut.execute(userId, {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        })

        //assert
        expect(result).toBe(user)
    })

    it('should update user successfully (with email)', async () => {
        //arrange
        const { sut, getUserByEmailRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByEmailRepository, 'execute')
        const email = faker.internet.email()
        //act
        const result = await sut.execute(faker.string.uuid(), {
            email,
        })
        //assert
        expect(result).toBe(user)
        expect(executeSpy).toHaveBeenCalledWith(email)
    })
})
