import { EmailAlreadyInUseError } from '../../errors/user.js'

export class UpdateUserUseCase {
    constructor(
        postgresGetUserByEmailRepository,
        postgresUpdateUserRepository,
        passwordHasherAdapter,
    ) {
        this.postgresGetUserByEmailRepository = postgresGetUserByEmailRepository
        this.postgresUpdateUserRepository = postgresUpdateUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
    }

    async execute(userId, updateUserParams) {
        //se o email estiver sendo atualizado, verificar se o email já existe para outro usuário
        if (updateUserParams.email) {
            //chamar o repositório para verificar se o email já existe
            const userWithProvidedEmail =
                await this.postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                )

            if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
                throw new EmailAlreadyInUseError(updateUserParams.email)
            }
        }

        const user = {
            ...updateUserParams,
        }

        //se a senha estiver sendo atualizada, criptografar a nova senha
        if (updateUserParams.password) {
            //criptografar a senha usando bcrypt
            const hashedPassword = await this.passwordHasherAdapter.execute(
                updateUserParams.password,
            )

            user.password = hashedPassword
        }

        //chamar o repositório para atualizar o usuário no banco de dados
        const updateUser = await this.postgresUpdateUserRepository.execute(
            userId,
            user,
        )
        return updateUser
    }
}
