import jwt from 'jsonwebtoken'
export class TokensGeneratorAdapter {
    async execute(userId) {
        const accessToken = jwt.sign(
            { userId },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' },
        )
        const refreshToken = jwt.sign(
            { userId },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' },
        )

        return {
            accessToken,
            refreshToken,
        }
    }
}
