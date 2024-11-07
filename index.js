const express = require('express')
const exphbs = require('express-handlebars')
const conn = require('./db/conn')
const Veiculo = require('./models/Veiculos')
const Situacao = require('./models/Situacao')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.get('/', async (req, res) => {
    try {
        
        const veiculos = await Veiculo.findAll({
            include: [{
                model: Situacao, 
                required: true, // somente veículos que têm situações
            }],
            raw: true,
            nest: true, // aninha as situações dentro dos veículos
        })
        res.render('home', { veiculos })
    } catch (error) {
        console.error('Erro ao buscar os veículos:', error)
        res.status(500).send('Erro interno do servidor')
    }
})

app.get('/veiculos/create', async (req, res) => {
    const situacoes = await Situacao.findAll({ raw: true })
    res.render('veiculosform', { situacoes })
})

app.post('/veiculos/add', async (req, res) => {
    const { modelo, marca, placa, situacaoId } = req.body

    await Veiculo.create({
        modelo,
        marca,
        placa,
        situacaoId, 
    })

    res.redirect('/')
})

app.get('/veiculos/edit/:id', async (req, res) => {
    try {
        const id = req.params.id
        const veiculo = await Veiculo.findByPk(id, {
            include: [Situacao],
            raw: true
        })
        
        if (!veiculo) {
            return res.status(404).send('Veículo não encontrado')
        }

        const situacoes = await Situacao.findAll({ raw: true }) 
        res.render('veiculosform', { veiculo, situacoes })
    } catch (error) {
        console.error('Erro ao buscar veículo para edição:', error)
        res.status(500).send('Erro interno do servidor')
    }
})

app.post('/veiculos/update/:id', async (req, res) => {
    const id = req.params.id
    const { modelo, marca, placa, situacaoId } = req.body

    try {
        await Veiculo.update({
            modelo,
            marca,
            placa,
            situacaoId,
        }, {
            where: { id }
        })

        res.redirect('/')
    } catch (error) {
        console.error('Erro ao atualizar veículo:', error)
        res.status(500).send('Erro interno do servidor')
    }
})

app.post('/veiculos/delete/:id', async (req, res) => {
    const id = req.params.id

    try {
        await Veiculo.destroy({
            where: { id }
        })

        res.redirect('/')
    } catch (error) {
        console.error('Erro ao deletar veículo:', error)
        res.status(500).send('Erro interno do servidor')
    }
})


conn.sync({force:false}).then(async () => {
    await Situacao.destroy({ where: {}})
    await Situacao.bulkCreate([
        { situacao: 'Disponivel' },
        { situacao: 'Alugado' },
        { situacao: 'Manutenção' },
    ])

    app.listen(3000, () => {
        console.log('http://localhost:3000')
    })
})

