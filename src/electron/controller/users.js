import UsersModel from '../model/users'
import Controller from '../controller'

export default class Users extends Controller {
  get auth () { return true }

  async info () {
    const user = await UsersModel.findOne({
      where: { id: this.uid }
    })
    return { id: user.id, name: user.name, username: user.username }
  }
  async changePwd (oldPassword, newPassword) {
    const user = await UsersModel.findOne({
      where: { id: this.uid }
    })
    if (user.password !== oldPassword) {
      throw new Error('旧密码错误')
    }
    return UsersModel.update({ password: newPassword }, {
      where: { id: this.uid }
    })
  }
}