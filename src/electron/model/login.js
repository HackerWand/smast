import db from '../db'
import { DataTypes } from 'sequelize'

export default db.define('Login', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  uid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  freezeTableName: true,
  indexes: [
    { fields: ['token'] }
  ]
})