import { PostgresHelper } from '../../db/postgres/helper'

export class PostgresDeleteUser {
    execute(userId) {
        const deleteUser = PostgresHelper.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [userId],
        )
        return deleteUser[0]
    }
}
