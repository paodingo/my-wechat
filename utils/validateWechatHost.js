const { createHash } = require('crypto')

const vaildateWechatHost = async (ctx) => {
    const token = "paodingo"
    const { signature, echostr, timestamp, nonce } = ctx.query
    // 将token、ptimestam、nonce三个参数进行字典序排序
    const stringArray = [timestamp, nonce, token]
    const resultArray = stringArray.sort()
    // 将三个参数字符串拼成一个字符串进行sha1加密
    const resultString = resultArray.join('')
    const hashResult = createHash('sha1').update(resultString).digest('hex')

    let isWechatHost = false
    if (hashResult === signature) {
        isWechatHost = true

    }
    return { echostr, isWechatHost }
}

module.exports = vaildateWechatHost
