import { uuidv4 } from 'zod'

export class IdGeneratorAdapter {
    async execute() {
        return uuidv4()
    }
}
