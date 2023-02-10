import db from '../db'
import Controller from '../controller'

export default class Db extends Controller {
  async sync (params) {
    await db.sync(params)
  }
  async install () {
    await db.sync({ force: true })
  }
}