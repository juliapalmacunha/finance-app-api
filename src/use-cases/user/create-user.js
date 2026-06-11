import { v4 as uuidv4 } from 'uuid'
import { EmailAlreadyInUseError } from '../../errors/user.js'

//RESPONSAVEL POR RECEBER OS PARAMETROS DO CONTROLLER, FAZER AS REGRAS DE NEGOCIO E CHAMAR O REPOSITORY

export class CreateUserUseCase {
    constructor(
        postgresGetUserByEmailRepository,
        postgresCreateUserRepository,
        bcryptAdapter,
    ) {
        this.postgresGetUserByEmailRepository = postgresGetUserByEmailRepository
        this.postgresCreateUserRepository = postgresCreateUserRepository
        this.passwordHasherAdapter = bcryptAdapter
    }

    async execute(createUserParams) {
        //verificar se o email ja esta em uso
        const userWithProvidedEmail =
            await this.postgresGetUserByEmailRepository.execute(
                createUserParams.email,
            )

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }

        //gerar id do user
        const userId = uuidv4()

        //criptografar a senha do user
        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        )

        //vai inserir o user no banco de dados
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        //chamar o repository
        const createdUser =
            await this.postgresCreateUserRepository.execute(user)
        return createdUser
    }
}
