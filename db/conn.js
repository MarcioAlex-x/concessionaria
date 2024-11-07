const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('consecionaria','root','root',{ //nome do banco, usuário, senha
    host: 'localhost',
    dialect: 'mysql'
})
try{
    sequelize.authenticate()
    console.log('Conectado com sucesso')
}catch(err){
    console.log('Não Foi possível conectar ao banco de dados', err)
}

module.exports = sequelize
