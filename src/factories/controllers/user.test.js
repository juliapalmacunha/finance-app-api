import {
    CreateUserController,
    UpdateUserController,
    DeleteUserController,
    GetUserByIdController,
    GetUserBalanceController,
} from '../../controllers'
import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserByIdController,
    makeUpdateUserController,
    makeGetUserBalanceController,
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

    it('should return a valid GetUserByIdController instance', () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })

    it('should return a valid GetUserBalanceController instance', () => {
        expect(makeGetUserBalanceController()).toBeInstanceOf(
            GetUserBalanceController,
        )
    })
})
