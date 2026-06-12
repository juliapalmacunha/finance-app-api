import { notFound } from '../helpers/http.js'

export const userNotFoundResponse = () => {
    return notFound({
        message: 'User not found.',
    })
}
