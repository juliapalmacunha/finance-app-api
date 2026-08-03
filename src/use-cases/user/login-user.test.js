import { InvalidPasswordError, UserNotFoundError } from '../../errors/user'
import { user } from '../../tests'
import { LoginUserUseCase } from './login-user'

describe('LoginUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }
    class PasswordComparatorAdapterStub {
        async execute() {
            return true
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordComparatorAdapter = new PasswordComparatorAdapterStub()
        const sut = new LoginUserUseCase(
            getUserByEmailRepository,
            passwordComparatorAdapter,
        )
        return {
            getUserByEmailRepository,
            passwordComparatorAdapter,
            sut,
        }
    }

    it('should throw UserNotFoundError if email does not exist', async () => {
        //arrange
        const { sut, getUserByEmailRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockResolvedValueOnce(null)

        //act
        const promise = sut.execute(user.email)

        //assert
        await expect(promise).rejects.toThrow(new UserNotFoundError(user.email))
    })

    it('should throws InvalidPasswordError if password is invalid', async () => {
        //arrange
        const { sut, passwordComparatorAdapter } = makeSut()
        import.meta.jest
            .spyOn(passwordComparatorAdapter, 'execute')
            .mockReturnValueOnce(false)

        //act
        const promise = sut.execute(user.email, user.password)

        //assert
        await expect(promise).rejects.toThrow(new InvalidPasswordError())
    })
})
