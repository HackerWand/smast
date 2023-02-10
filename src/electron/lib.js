const os = require('os')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

export const SECURITY_CODE = 'Wh81723&^%^!@#GBNJDA*SI&^T!@G#BN'

// const __static = process.env.NODE_ENV === 'development' ? path.join(__dirname, '../../static') : path.join(process.resourcesPath, 'static')

export const appPath = process.env.NODE_ENV === 'development' || process.platform === 'win32' ? process.cwd() : path.dirname(path.join(process.execPath, '../../'))

let machineCode = null
export function getMachineCode () {
    if (machineCode) {
        return machineCode
    }
    const cpus = os.cpus()
    if (!cpus.length) {
        throw new Error('MachineCode Error 001')
    }

    const networkInterfaces = os.networkInterfaces()
    let mac = null
    for (let netType of Object.keys(networkInterfaces)) {
        for (let item of networkInterfaces[netType]) {
            if (item.family === 'IPv4' && !['127.0.0.1', '::1'].includes(item.address) && !item.internal) {
                mac = item.mac
                break
            }
        }
    }
    if (!mac) {
        throw new Error('MachineCode Error 002')
    }

    return machineCode = md5([cpus[0].model, mac, SECURITY_CODE].join('-'))
}

export function md5 (txt) {
    var hash = crypto.createHash("md5")
    hash.update(txt)
    return hash.digest('hex').toUpperCase()
}

export function isFile (path) {
    return new Promise(resolve => {
        fs.stat(path, (err, stats) => {
            if (err !== null) {
                resolve(false)
            } else {
                resolve(stats.isFile())
            }
        })
    })
}

export function isDir (path) {
    return new Promise(resolve => {
        fs.stat(path, (err, stats) => {
            if (err !== null) {
                resolve(false)
            } else {
                resolve(stats.isDirectory())
            }
        })
    })
}