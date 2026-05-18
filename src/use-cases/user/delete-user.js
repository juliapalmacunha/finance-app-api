export class DeleteUserUseCase {
    constructor(postgresDeleteUserRepository) {
        this.postgresDeleteUserRepository = postgresDeleteUserRepository
    }

    async execute(userId) {
        //chamar o repositorio para deletar o user do banco
        const deletedUser =
            await this.postgresDeleteUserRepository.execute(userId)

        return deletedUser
    }
}
