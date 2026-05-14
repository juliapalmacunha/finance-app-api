import { PostgresDeleteUserRepository } from '../repositories/postgres/index.js'

export class DeleteUserUseCase {
    async execute(userId) {
        //chamar o repositorio para deletar o user do banco
        const deleteUserRepository = new PostgresDeleteUserRepository()
        const deletedUser = await deleteUserRepository.execute(userId)

        return deletedUser
    }
}
