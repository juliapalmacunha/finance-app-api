import { EmailAlreadyInUseError } from '../errors/user'
import { PostgresGetUserByIdRepository } from '../repositories/postgres/get-user-by-id'
import bcrypt from 'bcrypt'
import { PostgresUpdateUserRepository } from '../repositories/postgres/update-user'

export class UpdateUserUseCase {
    async execute(userId, updateUserParams) {
        //se o email estiver sendo atualizado, verificar se o email já existe para outro usuário
        if (updateUserParams.email) {
            //chamar o repositório para verificar se o email já existe
            const postgresGetUserByIdRepository =
                new PostgresGetUserByIdRepository()
            const userWithProvidedEmail =
                await postgresGetUserByIdRepository.execute(
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
        const updateUser = await new postgresUpdateUserRepository.execute(
            userId,
            user,
        )
        return updateUser
    }
}
