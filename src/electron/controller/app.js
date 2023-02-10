import { appPath, getMachineCode, SECURITY_CODE, md5 } from '../lib'
import Users from '../model/users'
import Configs from '../model/configs'
import Login from '../model/login'
import Controller from '../controller'

export default class App extends Controller {
  md5 (txt) {
    return md5(txt)
  }
  path () {
    return appPath
  }
  getMachineCode () {
    return getMachineCode()
  }
  checkActivationCode (code) {
    const mcode = getMachineCode()
    return md5([mcode, SECURITY_CODE].join('-')).toUpperCase() === code
  }
  generateActivationCode (code) {
    return md5([code, SECURITY_CODE].join('-')).toUpperCase()
  }
  async init ({name, orgName, username, password, activationCode}) {
    await Configs.update({ value: orgName }, {
      where: { key: 'orgName' }
    })
    await Configs.update({ value: activationCode }, {
      where: { key: 'activationCode' }
    })
    await Configs.update({ value: new Date().getTime() }, {
      where: { key: 'activationTime' }
    })
    await Users.create({ name, username, password })
  }
  async login (username, password) {
    const user = await Users.findOne({ where: { username } })
    if (!user) {
      throw new Error('账号不存在')
    }
    if (user.password !== password) {
      throw new Error('密码错误')
    }
    const token = md5([user.id, username, password, SECURITY_CODE].join('-'))
    await Login.destroy({
      where: { uid: user.id }
    })
    await Login.create({ token, uid: user.id })
    return { token }
  }
  async logout () {
    if (this.token) {
      await Login.destroy({
        where: { token: user.id }
      })
    }
  }
}