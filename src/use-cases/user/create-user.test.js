import { CreateUserUseCase } from './create-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { user } from '../../tests/index.js'

describe('Create User Use Case', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class CreateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed-password'
        }
    }

    class IdGeneratorAdapterStub {
        async execute() {
            return 'generated-id'
        }
    }

    const createUser = {
        ...user,
        id: undefined,
    }

    const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
    const createUserRepository = new CreateUserRepositoryStub()
    const passwordHasherAdapter = new PasswordHasherAdapterStub()
    const idGeneratorAdapter = new IdGeneratorAdapterStub()

    const makeSut = () => {
        const sut = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        }
    }

    it('should create a user successfully', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute(createUser)

        //assert
        expect(result).toBeTruthy()
    })

    it('should throw EmailAlreadyInUseError if email is already in use', async () => {
        //arrange
        const { sut, getUserByEmailRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockResolvedValueOnce(user)
        //act
        await expect(sut.execute(createUser)).rejects.toThrow(
            EmailAlreadyInUseError,
        )
    })

    it('should call passwordHasherAdapter to generate a cryptograph password', async () => {
        //arrange
        const { sut, passwordHasherAdapter, createUserRepository } = makeSut()
        const passwordHasherSpy = import.meta.jest.spyOn(
            passwordHasherAdapter,
            'execute',
        )
        const createUserRepositorySpy = import.meta.jest.spyOn(
            createUserRepository,
            'execute',
        )

        //act
        await sut.execute(createUser)

        //assert
        expect(passwordHasherSpy).toHaveBeenCalledWith(createUser.password)
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...createUser,
            id: 'generated-id',
            password: 'hashed-password',
        })
    })

    it('should call idGeneratorAdapter to generate a random id ', async () => {
        //arrange
        const { sut, idGeneratorAdapter, createUserRepository } = makeSut()
        const idGeneratorSpy = import.meta.jest.spyOn(
            idGeneratorAdapter,
            'execute',
        )
        const createUserRepositorySpy = import.meta.jest.spyOn(
            createUserRepository,
            'execute',
        )

        //act
        await sut.execute(createUser)

        //assert
        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...createUser,
            id: 'generated-id',
            password: 'hashed-password',
        })
    })

    it('should throw if GetUserByEmailRepository throws ', async () => {
        //arrange
        const { sut, getUserByEmailRepository } = makeSut()

        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(createUser)

        //act
        await expect(promise).rejects.toThrow()
    })

    it('should throw if idGeneratorAdapter throws ', async () => {
        //arrange
        const { sut, idGeneratorAdapter } = makeSut()

        import.meta.jest
            .spyOn(idGeneratorAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        const promise = sut.execute(createUser)

        //act
        await expect(promise).rejects.toThrow()
    })

    it('should throw if passwordHasherAdapter throws ', async () => {
        //arrange
        const { sut, passwordHasherAdapter } = makeSut()

        import.meta.jest
            .spyOn(passwordHasherAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        const promise = sut.execute(createUser)

        //act
        await expect(promise).rejects.toThrow()
    })

    it('should throw if CreateUserRepository throws ', async () => {
        //arrange
        const { sut, createUserRepository } = makeSut()

        import.meta.jest
            .spyOn(createUserRepository, 'execute')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(createUser)

        //act
        await expect(promise).rejects.toThrow()
    })
})
