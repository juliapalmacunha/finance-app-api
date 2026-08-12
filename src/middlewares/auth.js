import jwt from 'jsonwebtoken'

export const auth = (request, response, next) => {
    try {
        //pegar o access token do header que o user enviou na hora de fazer login
        //separar esse bearer do access token para poder captura-lo na posicao 1
        const accessToken = request.headers?.authorization?.split('Bearer ')[1]
        //caso nao exista access token ele retorna um erro 401
        if (!accessToken) {
            return response.status(401).send({ message: 'Unauthorized' })
        }

        //verificar se o access token é valido
        //verificando se esse jwt que chegou foi assinado com a chave secreta da aplicação
        const decodedToken = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_TOKEN_SECRET,
        )
        //se esse token nao for valido de acordo com a chave secreta da nossa aplicação ele retorna um erro 401
        if (!decodedToken) {
            return response.status(401).send({ message: 'Unauthorized' })
        }

        request.userId = decodedToken.userId

        console.log('auth middleware is running')
        next()
    } catch (error) {
        console.log('auth middleware error', error)
        return response.status(401).send({ message: 'Unauthorized' })
    }
}
