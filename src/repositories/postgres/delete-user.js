import { PostgresHelper } from '../../db/postgres/helper'

export class PostgresDeleteUserRepository {
    execute(userId) {
        //deletar o user do banco, tendo contato com o banco de dados
        const deleteUser = PostgresHelper.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [userId],
        )
        return deleteUser[0]
    }
}
