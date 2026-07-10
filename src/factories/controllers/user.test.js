import {
    CreateUserController,
    UpdateUserController,
    DeleteUserController,
} from '../../controllers'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeUpdateUserController,
} from './user'

describe('UserControllerFactories', () => {
    it('should return a valid CreateUserController instance', () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })

    it('should return a valid UpdateUserController instance', () => {
        expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController)
    })

    it('should return a valid DeleteUserController instance', () => {
        expect(makeDeleteUserController()).toBeInstanceOf(DeleteUserController)
    })
})
