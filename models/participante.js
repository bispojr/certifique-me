'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Participante extends Model {
    static associate(models) {
      // Relacionamentos serão definidos quando os outros models forem criados
      // Participante.hasMany(models.Certificado, {
      //   foreignKey: 'participanteId',
      //   as: 'certificados'
      // });
    }
  }

  Participante.init({
    nomeCompleto: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'nome_completo'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    instituicao: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Participante',
    tableName: 'participantes',
    paranoid: true, // Soft deletion
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return Participante;
};