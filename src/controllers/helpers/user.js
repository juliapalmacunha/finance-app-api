import { badRequest, notFound } from '../helpers/http.js'

export const invalidPasswordResponse = () => {
    return badRequest({
        message: 'Password must be at least 6 characters long',
    })
}

export const emailAlreadyInUseResponse = () => {
    return badRequest({
        message: 'Email invalid. Please choose another one.',
    })
}

export const userNotFoundResponse = () => {
    return notFound({
        message: 'User not found.',
    })
}
