import { CreateUserController } from '../../controllers'
import { makeCreateUserController } from './user'

describe('UserControllerFactories', () => {
    it('should return a valid CreateUserController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })
})
