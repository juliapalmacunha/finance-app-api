import { InvalidPasswordError, UserNotFoundError } from '../../errors/user.js'
import { user } from '../../tests/index.js'
import { LoginUserController } from './login-user.js'

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

    it('should return 401 when InvalidPasswordError is thrown', async () => {
        //arrange
        const { sut, loginUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new InvalidPasswordError()
            })

        const httpRequest = {
            body: {
                email: user.email,
                password: 'invalidPassword',
            },
        }

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(401)
    })
    it('should return 404 when UserNotFoundError is thrown', async () => {
        //arrange
        const { sut, loginUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new UserNotFoundError(user.email)
            })

        const httpRequest = {
            body: {
                email: user.email,
                password: 'invalidPassword',
            },
        }

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if LoginUserController throws an error', async () => {
        //arrange
        const { sut, loginUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockRejectedValueOnce(new Error())
        const httpRequest = {
            body: {
                email: user.email,
                password: 'invalidPassword',
            },
        }

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(500)
    })
})
