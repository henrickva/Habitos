import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './lib/routes'

const app = Fastify()

app.register(cors)
app.register(appRoutes)

//indicar a porta que está exibir uma mensagem no console que está ativo.
app.listen({
    port:3333,
}).then(()=>{
    console.log('Rodando Servidor')
})