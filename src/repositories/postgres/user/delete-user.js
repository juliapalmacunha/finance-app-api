import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresDeleteUserRepository {
    async execute(userId) {
        //deletar o user do banco, tendo contato com o banco de dados
        const deleteUser = await PostgresHelper.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [userId],
        )
        return deleteUser[0]
    }
}
