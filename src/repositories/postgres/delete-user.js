import { PostgresHelper } from '../../db/postgres/helper'

export class PostgresDeleteUserRepository {
    execute(userId) {
        const deleteUser = PostgresHelper.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [userId],
        )
        return deleteUser[0]
    }
}
