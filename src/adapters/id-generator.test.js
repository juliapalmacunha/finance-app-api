import { IdGeneratorAdapter } from './id-generator'
describe('IdGeneratorAdapter', () => {
    it('should generate a valid id', () => {
        //arrange
        const sut = new IdGeneratorAdapter()

        //act
        const result = sut.execute()

        //assert
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        const uuiRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        expect(result).toMatch(uuiRegex)
    })
})
