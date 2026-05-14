import { PostgresGetUserByIdRepository } from '../repositories/postgres/index.js'

export class GetUserByIdUseCase {
    async execute(userId) {
        //chamar o repositorio para pegar o user do banco
        const getUserByIdRepository = new PostgresGetUserByIdRepository()
        const user = await getUserByIdRepository.execute(userId)

        return user
    }
}
