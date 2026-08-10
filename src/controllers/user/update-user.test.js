import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user.js'
import {
    EmailAlreadyInUseError,
    UserNotFoundError,
} from '../../errors/index.js'
import { user } from '../../tests/index.js'

describe('UpdateUserController', () => {
    class UpdateUserUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const updateUserUseCase = new UpdateUserUseCaseStub()
        const sut = new UpdateUserController(updateUserUseCase)
        return { sut, updateUserUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
        body: {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({
                length: 7,
            }),
        },
    }

    it('should return 200 if user is updating successfully', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if invalid user email is provided', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                email: 'invalid-email',
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if password is not valid', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                password: faker.internet.password({ length: 5 }),
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if invalid userId is provided', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                userId: 'invalid-id',
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when unallowed field is provided', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            ...httpRequest,
            body: {
                ...httpRequest.body,
                unallowedField: 'invalid-value',
            },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 if UpdateUserController throws with generic error', async () => {
        //arrange
        const { sut, updateUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(updateUserUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        //act
        const result = await sut.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if UpdateUserUseCase throws with EmailAlreadyInUseError', async () => {
        //arrange
        const { sut, updateUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(updateUserUseCase, 'execute')
            .mockRejectedValueOnce(() => {
                new EmailAlreadyInUseError(faker.internet.email())
            })
        //act
        const result = await sut.execute(httpRequest)
        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should return 400 if id is not valid', async () => {
        // arrange
        const { sut } = makeSut()

        const httpRequestWithInvalidId = {
            ...httpRequest,
            params: {
                userId: 'invalid-id',
            },
        }

        // act
        const result = await sut.execute(httpRequestWithInvalidId)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 400 if email is already in use', async () => {
        // arrange
        const { sut, updateUserUseCase } = makeSut()

        import.meta.jest
            .spyOn(updateUserUseCase, 'execute')
            .mockRejectedValueOnce(new EmailAlreadyInUseError())

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(400)
    })

    it('should call UpdateUserUseCase with correct params', async () => {
        //arrange
        const { sut, updateUserUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(updateUserUseCase, 'execute')

        //act
        await sut.execute(httpRequest)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(
            httpRequest.params.userId,
            httpRequest.body,
        )
    })

    it('should return 404 if  throws with UserNotFoundError', async () => {
        // arrange
        const { sut, updateUserUseCase } = makeSut()

        import.meta.jest
            .spyOn(updateUserUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        // act
        const result = await sut.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(404)
    })
})
