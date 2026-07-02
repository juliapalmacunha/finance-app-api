//ferramente nativa do node para rodar processos no terminal de forma automatica
import { execSync } from 'child_process'

export default async () => {
    console.log(
        '\n🐳 [Docker]: Garantindo que o container de testes está de pé...',
    )
    execSync('docker-compose up -d --wait postgres-test')

    console.log('🚀 [Prisma]: Sincronizando o banco de testes com db push...')
    execSync('npx prisma db push')

    console.log('✅ [Setup]: Tudo pronto! Iniciando os testes...\n')
}
