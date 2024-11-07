const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const Situacao = db.define('Situacao', {
    situacao: {
        type: DataTypes.ENUM('Alugado', 'Disponivel', 'Manutenção'),
        allowNull: false,
    },
});

module.exports = Situacao;
