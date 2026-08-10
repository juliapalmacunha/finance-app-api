import { user } from '../../tests'
import { LoginUserController } from './login-user'

describe('loginUserController', () => {
    class LoginUserUseCaseStub {
        async execute() {
            return {
                ...user,
                tokens: {
                    accessToken: 'accessToken',
                    refreshToken: 'refreshToken',
                },
            }
        }
    }

    const makeSut = () => {
        const loginUserUseCase = new LoginUserUseCaseStub()
        const sut = new LoginUserController(loginUserUseCase)
        return { sut, loginUserUseCase }
    }

    it('should return 200 and user data when login is successful', async () => {
        //arrange
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                email: user.email,
                password: 'validPassword',
            },
        }

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({
            ...user,
            tokens: {
                accessToken: 'accessToken',
                refreshToken: 'refreshToken',
            },
        })
    })

    it('should call LoginUserUseCase with correct params', async () => {
        //arrange
        const { sut, loginUserUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(loginUserUseCase, 'execute')

        //act
        await sut.execute({
            body: {
                email: user.email,
                password: 'validPassword',
            },
        })

        //assert
        expect(executeSpy).toHaveBeenCalledWith(user.email, 'validPassword')
    })

    it
})
