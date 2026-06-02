import { CreateUserController } from './create-user.js'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    it('should return 201 when creating a user successfully', async () => {
        //arrange: prepara o teste para ser executado
        const createUserController = new CreateUserController(
            new CreateUserUseCaseStub(),
        )

        const httpRequest = {
            body: {
                first_name: 'teste',
                last_name: 'teste',
                email: 'teste@teste.com',
                password: 'teste123',
            },
        }

        //act: executa a ação que queremos testar
        const result = await createUserController.execute(httpRequest)

        //assert: verifica se o resultado é o esperado
        expect(result.statusCode).toBe(201)
        expect(result.body).not.toBeNull()
        expect(result.body).not.toBeUndefined()
    })

    it('should return 400 if first_name is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                last_name: 'teste',
                email: 'teste@teste.com',
                password: 'teste123',
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'teste',
                email: 'teste@teste.com',
                password: 'teste123',
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'teste',
                last_name: 'teste',
                password: 'teste123',
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not valid', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'teste',
                last_name: 'teste',
                email: 'teste',
                password: 'teste123',
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'teste',
                last_name: 'teste',
                email: 'teste@teste.com',
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        //arrange
        const createUserUseCase = new CreateUserUseCaseStub()
        const createUserController = new CreateUserController(createUserUseCase)

        const httpRequest = {
            body: {
                first_name: 'teste',
                last_name: 'teste',
                email: 'teste@teste.com',
                password: '123',
            },
        }

        //act
        const result = await createUserController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
    })
})
