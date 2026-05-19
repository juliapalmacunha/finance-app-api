import { ok, serverError } from '../helpers/index.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    userNotFoundResponse,
} from '../helpers/index.js'

export class GetUserByIdController {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase
    }

    async execute(httpRequest) {
        try {
            if (!checkIfIdIsValid(httpRequest.params.id)) {
                return invalidIdResponse()
            }

            const user = await this.getUserByIdUseCase.execute(
                httpRequest.params.id,
            )

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
