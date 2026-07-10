import { PasswordHasherAdapter } from './password-hasher'
import { faker } from '@faker-js/faker'
describe('PasswordHasherAdapter', () => {
    it('should return a hashed password', async () => {
        //arrange
        const sut = new PasswordHasherAdapter()
        const password = faker.internet.password(8, true, /[A-Z]/, '1')

        //act
        const result = await sut.execute(password)

        //assert
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(typeof result).not.toBe(password)
    })
})
