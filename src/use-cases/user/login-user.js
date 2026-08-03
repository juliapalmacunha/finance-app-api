import bcrypt from 'bcrypt'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user'

export class LoginUserUseCase {
    constructor(getUserByEmailRepository) {
        this.getUserByEmailRepository = getUserByEmailRepository
    }
    async execute(email, password) {
        //verificar se o email existe no banco de dados
        const user = await this.getUserByEmailRepository.execute(email)
        if (!user) {
            throw new UserNotFoundError(email)
        }

        //verificar se a senha é valida
        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) {
            throw new InvalidPasswordError()
        }
    }
}
