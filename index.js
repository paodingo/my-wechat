const koa = require('koa')
const app = new koa()
const path = require('path')

const koaBody = require('koa-body').default
app.use(koaBody({
    json: true
}))

const static = require('koa-static')
app.use(static(path.join(__dirname, '/static')))

const views = require('koa-views')
app.use(views('./view', { map: { 'html': 'ejs' } }))


const Router = require('koa-router')
const router = new Router()
app.use(router.routes())

const xml2js = require('xml2js')

const vaildateWechatHost = require('./utils/validateWechatHost')
const { createResData } = require('./utils/createResponseData')

const { commConfig } = require('./config/commConfig')

app.use(async ctx => {

    let validateRes = await vaildateWechatHost(ctx)
    // console.log('validateRes ==>', validateRes)
    let resMsg = ''


    if (ctx.request.method == 'GET' && validateRes.isWechatHost) {
        ctx.body = validateRes.echostr
    } else if (ctx.request.method == 'POST' && validateRes.isWechatHost) {

        let xmlString = await xml2js.parseStringPromise(ctx.request.body)
        console.log('xmlString.xml ==>', xmlString.xml)
        let xmlTemp = xmlString.xml
        let xmlJson = {}
        for (let item in xmlTemp) {
            xmlJson[item] = xmlTemp[item][0]
        }

        // 如果点击了【查询运单】按钮
        if (xmlJson.MsgType == 'event' && xmlJson.EventKey == 'queryData') {
            xmlJson.MsgType = 'text'
            xmlJson.Content = `<a href='${commConfig.host}/detail?openid=${xmlJson.FromUserName}'>1.查询单个运单号，请点击我</a>\n***************************\n***************************\n<a href='http://paodingo.free.idcfengye.com/list?openid=${xmlJson.FromUserName}'>2.查询更多运单号，请点击我</a>`
        }

        // 如果点击了【关于我们】按钮
        if (xmlJson.MsgType == 'event' && xmlJson.EventKey == 'aboutUs') {
            xmlJson.MsgType = 'text'
            xmlJson.Content = `感谢您的关注`
        }

        resMsg = createResData(xmlJson)

        ctx.body = resMsg
    } else {

        ctx.body = "hello world!"
    }

})

router.get('/detail', async (ctx) => {
    await ctx.render('detail', {})
})

router.get('/list', async (ctx) => {
    await ctx.render('list', {})
})

app.listen('8000')
console.log('serve is on at 8000')