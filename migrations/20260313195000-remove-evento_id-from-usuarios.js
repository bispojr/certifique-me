'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('usuarios', 'evento_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('usuarios', 'evento_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
