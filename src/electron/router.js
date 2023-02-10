import Login from './model/login'

let files = require.context('./controller', false, /\.js$/)
let modules = {}
files.keys().forEach(key => {
  const obj = files(key).default
  modules[obj.name] = obj
})

export default async function (event, path, ...args) {
  const [C, A] = path.indexOf('?') === -1 ? path.split('.') : path.split('?')[0].split('.')
  if (!modules[C]) {
    throw new Error('Controller ' + C + ' not exist')
  }
  const request = new modules[C]()
  if (!request[A]) {
    throw new Error('Action ' + C + '.' + A + ' not exist')
  }

  let params = {}
  if (path.indexOf('?') > -1) {
    path.split('?')[1].split('&').forEach(item => {
      const [k, v] = item.split('=')
      params[k] = v
    })
  }

  if (request.auth) {
    if (!params.token) {
      throw new Error('请先登录 001')
    }
    const login = await Login.findOne({
      where: { token: params.token }
    })
    if (!login) {
      throw new Error('请先登录 002')
    }
    request.uid = login.uid
  }

  try {
    return request[A](...args)
  } catch (e) {
    e.message = path + ' Action error => ' + e.message
    return Promise.reject(e)
  }
}