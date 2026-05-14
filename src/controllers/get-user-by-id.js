import { GetUserByIdUseCase } from '../use-cases/index.js'
import { ok, serverError } from '../controllers/helpers/http.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    userNotFoundResponse,
} from './helpers/user.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            if (!checkIfIdIsValid(httpRequest.params.id)) {
                return invalidIdResponse()
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()
            const user = await getUserByIdUseCase.execute(httpRequest.params.id)

            if (!user) {
                return userNotFoundResponse()
            }
            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
