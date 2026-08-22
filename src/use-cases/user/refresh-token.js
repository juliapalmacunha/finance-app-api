import { UnauthorizedError } from '../../errors/index.js'

export class RefreshTokenUseCase {
    constructor(tokensGeneratorAdapter, tokenVerifierAdapter) {
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
        this.tokenVerifierAdapter = tokenVerifierAdapter
    }

    async execute(refreshToken) {
        try {
            const decodedToken = await this.tokenVerifierAdapter.execute(
                refreshToken,
                process.env.JWT_REFRESH_TOKEN_SECRET,
            )
            console.log(decodedToken)

            if (!decodedToken || !decodedToken.userId) {
                throw new UnauthorizedError()
            }

            return this.tokensGeneratorAdapter.execute(decodedToken.userId)
        } catch (error) {
            console.log(error)
            throw new UnauthorizedError()
        }
    }
}
