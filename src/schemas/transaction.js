import { z } from 'zod'
import validator from 'validator'

export const createTransactionSchema = z.object({
    user_id: z
        .string({
            required_error: 'User must be a valid UUID',
        })
        .uuid({
            message: 'Invalid user ID format',
        }),
    name: z
        .string({
            required_error: 'Name is required',
        })
        .trim()
        .min(1, {
            message: 'Name is required',
        }),
    date: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? 'Date is required'
                    : 'Date must be a valid date',
        })
        .datetime({
            message: 'Date must be a valid date',
        }),
    type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT'], {
        error: (issue) =>
            issue.input === undefined
                ? 'Type is required'
                : 'Type must be EXPENSE, EARNING, or INVESTMENT',
    }),
    amount: z
        .number({
            required_error: 'Amount is required',
            invalid_type_error: 'Amount must be a number',
        })
        .min(1, {
            message: 'Amount must be greater than zero',
        })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            }),
        ),
})

//o que essa linha representa:
//partial torna todos os campos de cima opcionais
//o strict diz: se o usuario passar algum campo que nao seja um que ta aqui ele vai impedir
//omit ele remove certas propriedades, vai tirar a propriedade userid porque ela nao deve ser atualizada
export const updateTransactionSchema = createTransactionSchema
    .omit({
        user_id: true,
    })
    .partial()
    .strict({
        message: 'Some provide field is not allowed',
    })
