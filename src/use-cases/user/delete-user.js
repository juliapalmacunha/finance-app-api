export class DeleteUserUseCase {
    constructor(deleteUserRepository) {
        this.deleteUserRepository = deleteUserRepository
    }

    async execute(userId) {
        //chamar o repositorio para deletar o user do banco
        const deletedUser = await this.deleteUserRepository.execute(userId)

        return deletedUser
    }
}
