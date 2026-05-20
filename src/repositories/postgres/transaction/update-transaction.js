import { PostgresHelper } from '../../../db/postgres/helper'

export class PostgresUpdateTransactionRepository {
    async execute(TransactionId, updateTransactionParams) {
        //criando listas para que os parametros
        // entrem na posição certa e isso seja enviado para o postgres em linguagem sql
        const updateFields = []
        const updateValues = []

        Object.keys(updateTransactionParams).forEach((key) => {
            updateFields.push(`${key} = $${updateFields.length + 1}`)
            updateValues.push(updateTransactionParams[key])
        })

        updateValues.push(TransactionId)

        const updateQuery = `
            UPDATE transactions 
            SET ${updateFields.join(', ')} 
            WHERE id = $${updateValues.length}
            RETURNING *
            `

        const updatedTransaction = await PostgresHelper.query(
            updateQuery,
            updateValues,
        )

        return updatedTransaction[0]
    }
}
