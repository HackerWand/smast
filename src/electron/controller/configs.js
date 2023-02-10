import ConfigsModel from '../model/configs'
import { getMachineCode } from '../lib'
import Controller from '../controller'

export default class Configs extends Controller {
  async get () {
    const configs = await ConfigsModel.findAll()
    return configs.map(v => v.toJSON())
  }
  set (key, value) {
    return ConfigsModel.update({ value }, {
      where: { key }
    })
  }
  async init () {
    const configs = await ConfigsModel.bulkCreate([
      { key: 'machineCode', value: getMachineCode() },
      { key: 'activationCode', value: null },
      { key: 'activationTime', value: null },
      { key: 'orgName', value: null },
    ])
    return configs.map(v => v.toJSON())
  }
}