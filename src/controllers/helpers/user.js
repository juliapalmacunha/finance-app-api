import { badRequest, notFound } from '../helpers/http.js'
import validator from 'validator'

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

export const checkIfPasswordIsValid = (password) => {
    return password.length >= 6
}

export const checkIfEmailIsValid = (email) => {
    return validator.isEmail(email)
}
