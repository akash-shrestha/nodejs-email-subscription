const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Email = sequelize.define('subscribtion_emails', {
  email: {
    type: Sequelize.STRING,
    allowNull: false
  }
}
)

module.exports = Email;