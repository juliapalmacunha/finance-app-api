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
        expect(result.body.tokens.accessToken).toBe('accessToken')
        expect(result.body.tokens.refreshToken).toBe('refreshToken')
    })
})
