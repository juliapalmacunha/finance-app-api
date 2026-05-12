import { EmailAlreadyInUseError } from '../errors/user.js'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import bcrypt from 'bcrypt'
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user.js'

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        //se o email estiver sendo atualizado, verificar se o email já existe para outro usuário
        if (updateUserParams.email) {
            //chamar o repositório para verificar se o email já existe
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()
            const userWithProvidedEmail =
                await postgresGetUserByEmailRepository.execute(
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
            const hashedPassword = await bcrypt.hash(
                updateUserParams.password,
                10,
            )
            user.password = hashedPassword
        }

        //chamar o repositório para atualizar o usuário no banco de dados
        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
        const updateUser = await postgresUpdateUserRepository.execute(
            userId,
            user,
        )
        return updateUser
    }
}
