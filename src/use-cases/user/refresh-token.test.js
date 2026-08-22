import { UnauthorizedError } from '../../errors/user.js'
import { RefreshTokenUseCase } from './refresh-token.js'

describe('RefreshTokenUseCase', () => {
    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'access-token',
                refreshToken: 'refresh-token',
            }
        }
    }

    class TokenVerifierAdapterStub {
        execute() {
            return {
                userId: 'user_id',
            }
        }
    }

    const makeSut = () => {
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()
        const tokenVerifierAdapter = new TokenVerifierAdapterStub()
        const sut = new RefreshTokenUseCase(
            tokensGeneratorAdapter,
            tokenVerifierAdapter,
        )

        return {
            sut,
            tokensGeneratorAdapter,
            tokenVerifierAdapter,
        }
    }

    it('should return new tokens when refresh token is valid', async () => {
        //arrange
        const { sut } = makeSut()
        //act
        const result = await sut.execute('valid-refresh-token')
        //assert
        expect(result).toEqual({
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
        })
    })

    it('should throw UnauthorizedError when refresh token is invalid', async () => {
        //arrange
        const { sut, tokenVerifierAdapter } = makeSut()
        import.meta.jest
            .spyOn(tokenVerifierAdapter, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        const promise = sut.execute('invalid-refresh-token')
        //assert
        await expect(promise).rejects.toThrow(UnauthorizedError)
    })
})
