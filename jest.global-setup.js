//ferramente nativa do node para rodar processos no terminal de forma automatica
import { execSync } from 'child_process'

// Função auxiliar para forçar uma pausa
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default async () => {
    console.log(
        '\n🐳 [Docker]: Garantindo que o container de testes está de pé...',
    )
    execSync('docker compose up -d --wait postgres-test')

    console.log('⏳ [Setup]: Aguardando o banco estabilizar as conexões...')
    await esperar(2000) // Aguarda 2 segundos antes de prosseguir

    console.log('🚀 [Prisma]: Sincronizando o banco de testes com db push...')
    execSync('npx prisma db push', { stdio: 'inherit' })

    console.log('✅ [Setup]: Tudo pronto! Iniciando os testes...\n')
}
