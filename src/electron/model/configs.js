import db from '../db'
import { DataTypes } from 'sequelize'

export default db.define('Configs', {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  freezeTableName: true
})