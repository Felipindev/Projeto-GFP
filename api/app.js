import cors from 'cors'
import express from 'express'
import { testarConexao } from './db.js'
import RotasUsuarios, {autenticarToken} from './routes/RotasUsuarios.js'
import RotasCategorias from './routes/RotasCategorias.js'
import RotasSubCategorias from './routes/RotasSubCategorias.js'
import RotasTransacoes from './routes/RotasTransacoes.js'
import RotasContas from './routes/RotasContas.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger.js'

const app = express() //criar uma instancia
testarConexao();

app.use(cors()); //habilitar o cors
app.use(express.json()); //habilitar o json no express

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
// app.use(RotasUsuarios);
app.get('/', (req, res) =>{
    res.redirect("/api-docs");
})

//rotas usuarios
app.get('/usuarios/filtrarNome', autenticarToken, RotasUsuarios.filtrarPorNome); //listar usuarios por nome
app.post('/usuarios', RotasUsuarios.novoUsuario); //criar um novo usuario
app.get('/usuarios', autenticarToken, RotasUsuarios.listarUsuarios); //listar todos os usuarios
app.post('/usuarios/login', RotasUsuarios.login); //fazer login
app.get('/usuarios/:id_usuario', autenticarToken, RotasUsuarios.listarUsuariosPorId); //listar um usuario por id
app.put('/usuarios/:id_usuario', autenticarToken, RotasUsuarios.atualizarTodos); //atualizar todos os campos de um usuario
app.patch('/usuarios/:id_usuario', autenticarToken, RotasUsuarios.atualizar); //atualizar campos especificos de um usuario
app.delete('/usuarios/:id_usuario', autenticarToken, RotasUsuarios.deletar); //excluir um usuario

//rotas categorias
app.post('/categorias', autenticarToken, RotasCategorias.nova); //criar uma nova categoria
app.get('/categorias/filtrarCategoria', autenticarToken, RotasCategorias.filtrarCategoria); //filtrar categorias por tipo de transacao
app.get('/categorias', autenticarToken, RotasCategorias.listar); //listar todas as categorias
app.get('/categorias/:id_categoria', autenticarToken, RotasCategorias.listarPorID); //listar uma categoria por id
app.put('/categorias/:id_categoria', autenticarToken, RotasCategorias.atualizarTodos); //atualizar todos os campos de uma categoria
app.patch('/categorias/:id_categoria', autenticarToken, RotasCategorias.atualizar); //atualizar campos especificos de uma categoria
app.delete('/categorias/:id_categoria', autenticarToken, RotasCategorias.deletar); //excluir uma categoria

//rotas subcategorias
app.get('/subCategorias/filtrarNome', autenticarToken, RotasSubCategorias.filtrarPorNome); //filtrar subcategorias por categoria
app.post('/subCategorias', autenticarToken, RotasSubCategorias.nova); //criar uma nova subcategoria
app.get('/subCategorias', autenticarToken, RotasSubCategorias.listar); //listar todas as subcategorias
app.get('/subCategorias/:id_subCategoria', autenticarToken, RotasSubCategorias.listarPorID); //listar uma subcategoria por id
app.put('/subCategorias/:id_subCategoria', autenticarToken, RotasSubCategorias.atualizarTodos); //atualizar todos os campos de uma subcategoria
app.patch('/subCategorias/:id_subCategoria', autenticarToken, RotasSubCategorias.atualizar); //atualizar campos especificos de uma subcategoria
app.delete('/subCategorias/:id_subCategoria', autenticarToken, RotasSubCategorias.deletar); //excluir uma subcategoria

//rotas contas
app.post('/contas', autenticarToken, RotasContas.novaConta);// criar nova conta
app.get('/contas/filtrarContas', autenticarToken, RotasContas.filtrarContas); //filtrar contas por tipo de conta
app.get('/contas', autenticarToken, RotasContas.listar) //listar todas as contas
app.get('/contas/:id_conta', autenticarToken, RotasContas.listarporID) //listar contas por id
app.put('/contas/:id_conta', autenticarToken ,RotasContas.atualizarTodos) // atualizar todos os campos de uma conta
app.patch('/contas/:id_conta', autenticarToken, RotasContas.atualizar); //atualizar um campo especifico de uma conta
app.delete('/contas/:id_conta', autenticarToken, RotasContas.deletar) //deletar uma conta

//rotas transacoes
app.get('/transacao/transacoesVencidas/:id_usuario' , autenticarToken, RotasTransacoes.transacoesVencidas)
app.get('/transacao/somarTransacoes', autenticarToken, RotasTransacoes.somarTransacoes)
app.get('/transacao/filtroData', autenticarToken, RotasTransacoes.filtrarPorData); //filtrar transacoes por tipo de transacao
app.post('/transacao', autenticarToken, RotasTransacoes.nova); //criar uma nova transacao
app.get('/transacao', autenticarToken, RotasTransacoes.listar); //listar todas as transacoes
app.get('/transacao/:id_transacao', autenticarToken, RotasTransacoes.listarPorID); //listar uma transacao por id
app.put('/transacao/:id_transacao', autenticarToken, RotasTransacoes.atualizarTodos); //atualizar todos os campos de uma transacao
app.patch('/transacao/:id_transacao', autenticarToken, RotasTransacoes.atualizar); //atualizar campos especificos de uma transacao
app.delete('/transacao/:id_transacao', autenticarToken, RotasTransacoes.deletar); //excluir uma transacao

const PORT = 3000;
app.listen(PORT,() =>{
    console.log(`Api rodando no http://localhost:${PORT}`);
})