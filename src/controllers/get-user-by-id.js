import { GetUserByIdUseCase } from '../use-cases/index.js'
import { notFound, ok, serverError } from '../controllers/helpers/http.js'
import { checkIfIdIsValid, invalidIdResponse } from './helpers/user.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            if (!checkIfIdIsValid(httpRequest.params.id)) {
                return invalidIdResponse()
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()
            const user = await getUserByIdUseCase.execute(httpRequest.params.id)

            if (!user) {
                return notFound({ message: 'User not found' })
            }
            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
