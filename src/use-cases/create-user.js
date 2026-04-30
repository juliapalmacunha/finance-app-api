import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { PostgresCreateUserRepository } from '../db/postgres/repositories/postgres/create-user.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        //verificar se o email ja esta em uso
        //gerar id do user
        const userId = uuidv4()

        //criptografar a senha do user
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

        //vai inserir o user no banco de dados
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        //chamar o repository
        const postgresCreateUserRepository = new PostgresCreateUserRepository()
        const createdUser = await postgresCreateUserRepository.execute(user)
        return createdUser
    }
}
