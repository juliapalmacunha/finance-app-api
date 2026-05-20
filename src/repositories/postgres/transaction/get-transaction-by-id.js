import { PostgresHelper } from '../../../db/postgres/helper'

export class PostgresGetTransactionsByIdRepository {
    async execute(userId) {
        const transactions = await PostgresHelper.query(
            'SELECT * FROM transactions WHERE userId = $1',
            [userId],
        )
        return transactions
    }
}
