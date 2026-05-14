import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import {
    PostgresGetUserByEmailRepository,
    PostgresCreateUserRepository,
} from '../repositories/postgres/index.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

//RESPONSAVEL POR RECEBER OS PARAMETROS DO CONTROLLER, FAZER AS REGRAS DE NEGOCIO E CHAMAR O REPOSITORY

export class CreateUserUseCase {
    async execute(createUserParams) {
        //verificar se o email ja esta em uso
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()
        const userWithProvidedEmail =
            await postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            )

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

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
