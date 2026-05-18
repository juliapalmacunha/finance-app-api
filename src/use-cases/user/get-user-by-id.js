//USE CASE É O INTERMEDIARIO DO CONTROLLER E REPOSITORY

//o controller chama ele passando os dados necessarios para completar a requisição
//ele chama o repository

export class GetUserByIdUseCase {
    constructor(getUserByIdRepository) {
        this.getUserByIdRepository = getUserByIdRepository
    }

    async execute(userId) {
        //chamar o repositorio para pegar o user do banco
        const user = await this.getUserByIdRepository.execute(userId)

        return user
    }
}
