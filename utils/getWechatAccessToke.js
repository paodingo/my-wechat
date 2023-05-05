const rq = require('request-promise')
const fs = require('fs')

const file_path = __dirname + '/token_file/accessToke.json'
const { commConfig } = require('../config/commConfig')

let uri = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${commConfig.appID}&secret=${commConfig.appsecret}`

const updateAccessToken = async () => {
    // 请求微信接口获取token
    console.log('00000000000000000000')
    console.log('uri ==>', uri)
    let resAccessToken = await rq(uri)
    let fomateToken = JSON.parse(resAccessToken)
    let expiresTime = new Date().getTime() + fomateToken.expires_in * 1000
    fomateToken.expiresTime = expiresTime
    fs.writeFileSync(file_path, JSON.stringify(fomateToken))
}

const getAccessToken = async () => {

    try {
        // 获取本地存储的accessToken
        let localToken = await fs.readFileSync(file_path, 'utf8')

        // 判断本地token是否过期
        let localTokenFormate = JSON.parse(localToken)
        let nowTime = new Date().getTime()

        let resultToken = ''
        if (nowTime - localTokenFormate.expiresTime >= 0) {
            await updateAccessToken()
            await getAccessToken()
        } else {
            resultToken = localTokenFormate.access_token
        }

        return resultToken
    } catch (e) {
        await updateAccessToken()
        await getAccessToken()
    }
}

module.exports = getAccessToken

setInterval(() => {
    getAccessToken().then(res => {
        // console.log('accessToken ==>', res)
    })
}, 1000 * 7200)


