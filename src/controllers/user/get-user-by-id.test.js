import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id.js'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }

    it('should return 200 if a user is found', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            params: { id: faker.string.uuid() },
        })
        console.log(result)

        //assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if is not valid id', async () => {
        //arrange
        const { sut } = makeSut()

        //act
        const result = await sut.execute({
            params: { id: 'invalid_id' },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })
})
