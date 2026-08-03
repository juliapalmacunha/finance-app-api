import { UserNotFoundError } from '../../errors/user'
import { user } from '../../tests'
import { LoginUserUseCase } from './login-user'

describe('LoginUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const sut = new LoginUserUseCase(getUserByEmailRepository)
        return {
            getUserByEmailRepository,
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
})
