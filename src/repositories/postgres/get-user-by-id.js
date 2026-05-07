import { PostgresHelper } from '../../db/postgres/helper'

export class PostgresGetUserByIdRepository {
    async execute(id) {
        const user = await PostgresHelper.query(
            'SELECT * FROM users WHERE ID = $1',
            [id],
        )

        return user[0]
    }
}
