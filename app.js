/**
 * Created by admin on 2016/10/3.
 */
var Koa = require('koa');
var path = require('path');
var sha1 = require('sha1');
var Wechat = require('./wechat/wechat');
/**
 * 处理
 */
var wechat = require('./wechat/g');
/**
 * 引入用户回复信息判断处理模块
 * */
var reply = require('./wx/reply');
/**
 * appID appSecret等配置信息
 * */
var config = require('./config');
var app = new Koa();

var ejs = require('ejs');
var crypto = require('crypto');
var heredoc = require('heredoc');
var tpl = heredoc(function(){/*
 <!DOCTYPE html>
 <html lang="en">
 <head>
 <meta charset="UTF-8">
 <meta name="viewport" content="initial-scale=1,maximum-scale=1,minimum-scale=1">
 <title>搜电影</title>
 </head>
 <body>
 <h1>点击标题,开始录音翻译</h1>
 <p id="title"></p>
 <div id=""poster></div>
 <script src="http://zeptojs.com/zepto-docs.min.js"></script>
 <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
 <script>
     wx.config({
         debug:false,
         appId:'wxb8df959670143619',
         timestamp:'<%= timestamp %>',
         nonceStr:'<%= noncestr %>',
         signature:'<%= signature %>',
         jsApiList:['startRecord','stopRecord','onVoiceRecordEnd','translateVoice']
     })
     wx.ready(function(){
         wx.checkJsApi({
             jsApiList: ['onVoiceRecordEnd'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
             success: function(res) {
                console.log(res)
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
             }
         });

        var isRecording = false;
         $('h1).on('tap',function(){
            if(!isRecording){
                wx.startRecord({
                    cancel:function(){
                        window.alert('那就搜不了了哦！')
                    }
                });
                return
            }
            isRecording = false;
            wx.stop
         })
     })

 </script>
 </body>
 </html>

*/})

/*生成随机数*/
var createNonce = function(){
    return Math.random().toString(36).substr(2, 15);
}
/*生成当前时间戳*/
var createTimestamp = function(){
    return parseInt(new Date().getTime() / 1000, 10) + '';
}
/*签名数组加密*/
var _sign = function(noncestr, ticket, timestamp, url){
    var params = [
        'noncestr=' + noncestr,
        'jsapi_ticket=' + ticket,
        'timestamp=' + timestamp,
        'url=' + url
    ];
    var str = params.sort().join('&');
    var shasum = crypto.createHash('sha1')
    shasum.update(str);
    return shasum.digest('hex');
}
function sign(ticket,url){
    var noncestr = createNonce();
    var timestamp = createTimestamp();
    var signature = _sign(noncestr, ticket, timestamp, url);
    return {
        noncestr:noncestr,
        timestamp:timestamp,
        signature:signature
    }
}

app.use(function *(next){
    if(this.url.indexOf('/movie')>-1){
        var wechatApi = new Wechat(config.wechat);
        /*先获取全局票据*/
        var data = yield wechatApi.fetchAccessToken();
        var access_token = data.access_token;
        /*根据全局票据获取SDK票据*/
        var ticketData = yield wechatApi.fetchTicket(access_token);
        var ticket = ticketData.ticket
        console.log(ticket)
        var url = this.href;
        console.log(url)
        /*获取签名数据*/
        var params = sign(ticket, url);
        /*将签名数据传入ejs模板*/
        console.log(params)
        this.body = ejs.render(tpl, params);
        return next
    }
    yield next
})

app.use(wechat(config.wechat,reply.reply))

app.listen(340)
console.log('Listening:340')
