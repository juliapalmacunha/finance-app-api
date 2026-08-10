import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js'
import { user } from '../../tests/index.js'
import { LoginUserUseCase } from './login-user.js'

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

    class TokensGeneratorAdapterStub {
        async execute() {
            return {
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
            }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordComparatorAdapter = new PasswordComparatorAdapterStub()
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()
        const sut = new LoginUserUseCase(
            getUserByEmailRepository,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
        )
        return {
            getUserByEmailRepository,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
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

    it('should return user with tokens if email and password are valid', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(user.email, user.password)

        //assert
        expect(result.tokens.accessToken).toBeDefined()
        expect(result.tokens.refreshToken).toBeDefined()
    })
})
