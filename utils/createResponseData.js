/**
 * 1.接收发送的内容
 * 2.接收发送的消息类型
 */

const createResData = (res) => {
    let commData = `<xml>
    <ToUserName><![CDATA[${res.FromUserName}]]></ToUserName>
    <FromUserName><![CDATA[${res.ToUserName}]]></FromUserName>
    <CreateTime>${new Date().getTime()}</CreateTime>
    <MsgType><![CDATA[${res.MsgType}]]></MsgType>`

    let newsItem = ''
    if (res.type == 'news') {
        res.content.forEach(element => {
            newsItem += `<item>
            <Title><![CDATA[${element.title}]]></Title>
            <Description><![CDATA[${element.description}]]></Description>
            <PicUrl><![CDATA[${element.picurl}]]></PicUrl>
            <Url><![CDATA[${element.url}]]></Url>
        </item>`
        })
    }
    let typeMap = {
        "text": `<Content><![CDATA[${res.Content}]]></Content>`,
        "news": `<ArticleCount><![CDATA[${res.count}]]></ArticleCount><Articles>` + newsItem + '</Articles>'
    }


    return commData + typeMap[res.MsgType] + '</xml>'
}

exports.createResData = createResData