import { EmailAlreadyInUseError } from '../../errors/user.js'
import { CreateUserController } from './create-user.js'
import { faker } from '@faker-js/faker'

describe('Create User Controller', () => {
    class CreateUserUseCaseStub {
        execute(user) {
            return user
        }
    }

    const makeSut = () => {
        const createUserUseCase = new CreateUserUseCaseStub()
        const sut = new CreateUserController(createUserUseCase)

        return {
            sut,
            createUserUseCase,
        }
    }

    const httpRequest = {
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 7,
            }),
        },
    }

    it('should return 201 when creating a user successfully', async () => {
        //arrange: prepara o teste para ser executado
        const { sut } = makeSut()

        //act: executa a ação que queremos testar
        const result = await sut.execute(httpRequest)

        //assert: verifica se o resultado é o esperado
        expect(result.statusCode).toBe(201)
        expect(result.body).toEqual(httpRequest.body)
    })

    it('should return 400 if first_name is not provided', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            ...httpRequest.body,
            first_name: undefined,
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if last_name is not provided', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            ...httpRequest.body,
            last_name: undefined,
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not provided', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            ...httpRequest.body,
            email: undefined,
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is not valid', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            ...httpRequest.body,
            email: 'invalid-email',
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not provided', async () => {
        //arrange
        const { sut } = makeSut()

        const httpRequest = {
            body: {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
            },
        }

        //act
        const result = await sut.execute({
            ...httpRequest.body,
            password: undefined,
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is less than 6 characters', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            ...httpRequest.body,
            password: faker.internet.password({ length: 5 }),
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should call createUserUseCase with correct params', async () => {
        //arrange
        const { sut, createUserUseCase } = makeSut()

        const executeSpy = jest.spyOn(createUserUseCase, 'execute')

        //act
        await sut.execute(httpRequest)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
    })

    it('should return 500 if createUserUseCase throws an error', async () => {
        //arrange
        const { sut, createUserUseCase } = makeSut()

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if createUserUseCase throws EmailAlreadyInUseError', async () => {
        //arrange
        const { sut, createUserUseCase } = makeSut()

        jest.spyOn(createUserUseCase, 'execute').mockRejectedValueOnce(
            new EmailAlreadyInUseError(httpRequest.body.email),
        )

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(400)
    })
})
