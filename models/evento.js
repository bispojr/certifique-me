'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Evento extends Model {
    static associate(models) {
      // Evento.hasMany(models.Atividade, { foreignKey: 'evento_id' });
    }
  }

  Evento.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      codigo_base: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      ano: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
  }, {
    sequelize,
    modelName: 'Evento',
    tableName: 'eventos',
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return Evento;
};
