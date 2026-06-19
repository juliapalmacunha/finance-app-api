import { EmailAlreadyInUseError } from '../../errors/user.js'

//RESPONSAVEL POR RECEBER OS PARAMETROS DO CONTROLLER, FAZER AS REGRAS DE NEGOCIO E CHAMAR O REPOSITORY

export class CreateUserUseCase {
    constructor(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
        idGeneratorAdapter,
    ) {
        this.postgresGetUserByEmailRepository = getUserByEmailRepository
        this.postgresCreateUserRepository = createUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
        this.idGeneratorAdapter = idGeneratorAdapter
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
        const userId = this.idGeneratorAdapter.execute()

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
