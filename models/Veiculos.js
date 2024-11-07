const { DataTypes } = require('sequelize')
const db = require('../db/conn')
const Situacao = require('./Situacao')

const Veiculo = db.define('Veiculo', {
    modelo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    placa: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    situacaoId: {
        type: DataTypes.INTEGER,
        references: {
            model: Situacao,
            key: 'id',
        },
    },
})

// Relacionamento: Um Veiculo tem uma Situacao
Veiculo.belongsTo(Situacao, { foreignKey: 'situacaoId' })

module.exports = Veiculo
