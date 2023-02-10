const { Sequelize } = require('sequelize')
import { appPath } from './lib'

export default new Sequelize({
    dialect: 'sqlite',
    storage: appPath + '/main.db',
    username: 'root',
    password: '123456',
    dialectModulePath: '@journeyapps/sqlcipher'
})
