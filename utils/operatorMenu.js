const rq = require('request-promise')
const getAccessToken = require('./getWechatAccessToke')

const createMenu = async () => {

    let accessToken = await getAccessToken()
    console.log('accessToken ==>', accessToken)


    let rqParam = {
        "button": [
            {
                "type": "click",
                "name": "aboutUs",
                "key": "aboutUs"
            },
            {
                "type": "click",
                "name": "query",
                "key": "queryData"
            },]
    }

    let param = {
        method: 'POST',
        uri: `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken}`,
        body: rqParam,
        json: true
    }
    let res = await rq.post(param)

    console.log('----------------------------------')
    console.log(res)

}

createMenu()