import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { badRequest, ok, serverError } from './helpers.js'
import validator from 'validator'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.id)
            if (!isIdValid) {
                return badRequest({ message: 'Invalid user ID format' })
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()
            const user = await getUserByIdUseCase.execute(httpRequest.params.id)

            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
