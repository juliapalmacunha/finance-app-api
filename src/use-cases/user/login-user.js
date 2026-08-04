import { InvalidPasswordError, UserNotFoundError } from '../../errors/user'

export class LoginUserUseCase {
    constructor(
        getUserByEmailRepository,
        passwordComparatorAdapter,
        tokensGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.passwordComparatorAdapter = passwordComparatorAdapter
        this.tokensGeneratorAdapter = tokensGeneratorAdapter
    }
    async execute(email, password) {
        //verificar se o email existe no banco de dados
        const user = await this.getUserByEmailRepository.execute(email)
        if (!user) {
            throw new UserNotFoundError(email)
        }

        //verificar se a senha é valida
        const passwordIsValid = await this.passwordComparatorAdapter.execute(
            password,
            user.password,
        )
        if (!passwordIsValid) {
            throw new InvalidPasswordError()
        }
        //gerar os tokens
        const tokens = await this.tokensGeneratorAdapter.execute(user.id)

        //retornar o usuario com os tokens
        return {
            user,
            tokens,
        }
    }
}
