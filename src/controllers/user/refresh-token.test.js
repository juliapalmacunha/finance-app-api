import { ZodError } from 'zod'
import { UnauthorizedError } from '../../errors/user.js'
import { RefreshTokenController } from './refresh-token.js'

describe('RefreshTokenController', () => {
    class RefreshTokenUseCaseStub {
        async execute() {
            return {
                accessToken: 'newAccessToken',
                refreshToken: 'newRefreshToken',
            }
        }
    }

    const makeSut = () => {
        const refreshTokenUseCase = new RefreshTokenUseCaseStub()
        const sut = new RefreshTokenController(refreshTokenUseCase)

        return {
            sut,
            refreshTokenUseCase,
        }
    }

    it('should return 200 when refreshing token successfully', async () => {
        //arrange
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                refreshToken: 'validRefreshToken',
            },
        }
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({
            accessToken: 'newAccessToken',
            refreshToken: 'newRefreshToken',
        })
    })

    it('shoul call RefreshTokenUseCase with correct refresh token', async () => {
        //arrange
        const { sut, refreshTokenUseCase } = makeSut()
        const httpRequest = {
            body: {
                refreshToken: 'validRefreshToken',
            },
        }
        const params = httpRequest.body
        const executeSpy = import.meta.jest.spyOn(
            refreshTokenUseCase,
            'execute',
        )
        //act
        await sut.execute(httpRequest)
        //assert
        expect(executeSpy).toHaveBeenCalledWith(params.refreshToken)
    })

    it('should return 401 if RefreshTokenUseCase throws UnauthorizedError', async () => {
        //arrange
        const { sut, refreshTokenUseCase } = makeSut()
        import.meta.jest
            .spyOn(refreshTokenUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new UnauthorizedError()
            })
        const httpRequest = {
            body: {
                refreshToken: 'invalidRefreshToken',
            },
        }
        //act
        const promise = await sut.execute(httpRequest)
        //assert
        expect(promise.statusCode).toBe(401)
    })

    it('should return 401 if RefreshTokenUseCase throws any error', async () => {
        //arrange
        const { sut, refreshTokenUseCase } = makeSut()
        import.meta.jest
            .spyOn(refreshTokenUseCase, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })
        const httpRequest = {
            body: {
                refreshToken: 'invalidRefreshToken',
            },
        }
        //act
        const promise = await sut.execute(httpRequest)
        //assert
        expect(promise.statusCode).toBe(500)
    })

    it('should return 400 if RefreshTokenUseCase throws ZodError', async () => {
        //arrange
        const { sut, refreshTokenUseCase } = makeSut()
        import.meta.jest
            .spyOn(refreshTokenUseCase, 'execute')
            .mockRejectedValueOnce(new ZodError())
        const httpRequest = {
            body: {
                refreshTokenerror: 'invalidRefreshToken',
            },
        }
        //act
        const promise = await sut.execute(httpRequest)
        //assert
        expect(promise.statusCode).toBe(400)
    })
})
