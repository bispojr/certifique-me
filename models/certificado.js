'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Certificado extends Model {
    static associate(models) {
      // Certificado.belongsTo(models.Evento, { foreignKey: 'evento_id' });
      // Certificado.belongsTo(models.TiposCertificados, { foreignKey: 'tipo_certificado_id' });
    }
  }

  Certificado.init({
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('liberado', 'suspenso'),
      allowNull: false,
      defaultValue: 'liberado'
    },
    valores_dinamicos: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    evento_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo_certificado_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Certificado',
    tableName: 'certificados',
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return Certificado;
};
