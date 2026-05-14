import { badRequest } from '../helpers/http.js'
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

export const invalidIdResponse = () => {
    return badRequest({
        message: 'Invalid user ID format. Please provide a valid UUID.',
    })
}

export const checkIfPasswordIsValid = (password) => {
    password.length >= 6
}

export const checkIfEmailIsValid = (email) => {
    validator.isEmail(email)
}

export const checkIfIdIsValid = (id) => {
    validator.isUUID(id)
}
