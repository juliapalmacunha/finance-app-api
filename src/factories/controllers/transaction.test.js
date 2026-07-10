import { CreateTransactionController } from '../../controllers'
import { makeCreateTransactionController } from './transaction'

describe('TransactionControllerFactories', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })
})
