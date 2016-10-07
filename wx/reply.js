/**
 * Created by admin on 2016/10/4.
 */
var config = require('./../config');
var Wechat = require('./../wechat/wechat');
var menu = require('./menu');
var wechatApi = new Wechat(config.wechat);



exports.reply = function* (next){
    var message = this.weixin;
    wechatApi.deleteMenu().then(function(){
        return wechatApi.createMenu(menu)
    }).then(function(msg){
        console.log(msg)
    });
    console.log(message)
    if (message.MsgType == 'event'){
        /*如果是订阅事件*/
        if(message.Event == 'subscribe'){
            console.log('扫码进来的')
            this.body = '哈哈,你订阅了这个号';
        }else if(message.Event == 'unsubscribe'){
            console.log('无情取关')
            this.body = '';
        }else if(message.Event == 'LOCATION'){
            this.body = '您上报的位置是:' + message.Latitude + '/' + message.Longitude + '-' + message.Precision;
        }else if(message.Event == 'CLICK'){
            this.body = '您点击了菜单:' + message.EventKey;
        }else if(message.Event =='SCAN'){
            console.log('关注后扫二维码' + message.EventKey+' '+message.Ticket);
            this.body = '看到你扫一下的哦'
        }else if(message.Event =='VIEW'){
            this.body = '您点击了菜单中的链接:' + message.EventKey;
        }else if(message.Event =='scancode_push'){
            console.log(message.ScanCodeInfo.ScanType)
            console.log(message.ScanCodeInfo.ScanResult)
            this.body = '您点击了菜单中的链接:' + message.EventKey;
        }else if(message.Event =='scancode_waitmsg'){
            console.log(message.ScanCodeInfo.ScanType)
            console.log(message.ScanCodeInfo.ScanResult)
            this.body = '您点击了菜单中的链接:' + message.EventKey;
        }else if(message.Event =='pic_sysphoto'){
            console.log(message.SendPicsInfo.PicList)
            console.log(message.SendPicsInfo.Count)
            this.body = '您点击了菜单中的链接:' + message.EventKey;
        }else if(message.Event =='pic_photo_or_album'){
            console.log(message.SendPicsInfo.PicList)
            console.log(message.SendPicsInfo.Count)
            this.body = '您点击了菜单中的链接:' + message.EventKey;
        }else if(message.Event =='pic_weixin'){
            console.log(message.SendPicsInfo.PicList)
            console.log(message.SendPicsInfo.Count)
            this.body = '您点击了菜单中的链接:' + message.EventKey;
        }else if(message.Event == 'location_select'){
            console.log(message.SendLocationInfo.Location_X)
            console.log(message.SendLocationInfo.Location_Y)
            console.log(message.SendLocationInfo.Scale)
            console.log(message.SendLocationInfo.Label)
            console.log(message.SendLocationInfo.Poiname)
            this.body = '您点击了菜单中的链接:' + message.EventKey;
        }
    }else if(message.MsgType == 'text'){
        var content = message.Content;
        var reply = '额，你说的'+content+'太复杂了';
        if(content == '1'){
            reply = '天下第一吃大米';
        }else if(content == '2'){
            reply = '天下第二吃豆腐';
        }else if(content == '3'){
            reply = '天下第三吃豆腐';
        }else if(content == '4'){
            reply = [{
                title: '技术改变世界',
                description: '只是个描述而已',
                picUrl:'http://img.mukewang.com/56f22f160001bac306000338-240-135.jpg',
                url:'http://www.sooszy.com'
            },{
                title: 'NodeJs',
                description: '1213123',
                picUrl:'http://img.mukewang.com/5707770d0001705706000338-240-135.jpg',
                url:'http://www.sooszy.com'
            }];
        }else if(content == '5'){  /*回复图片内容*/
            /*上传临时图片*/
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg');
            reply = {
                type: 'image',
                mediaId: data.media_id
            };
        }else if(content == '6'){  /*回复视频内容*/
            /*上传临时视频*/
            var data = yield wechatApi.uploadMaterial('video', __dirname + '/6.mp4');
            reply = {
                type: 'video',
                mediaId: data.media_id,
                title:'回复测试',
                description:'篮球'
            };
        }else if(content == '7'){  /*回复音乐内容*/
            /*上传临时音乐*/
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg');
            reply = {
                type: 'music',
                title:'回复音乐放松下',
                description:'音乐',
                thumbMediaId:data.media_id,
                musicUrl:'./music.mp3'
            };
        }else if(content == '8'){  /*回复音乐内容*/
            /*上传临时音乐*/
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg',{type:'image'});
            reply = {
                type: 'image',
                mediaId: data.media_id
            };
        }else if(content == '9'){  /*回复视频内容*/
            /*上传永久视频*/
            var data = yield wechatApi.uploadMaterial('video', __dirname + '/6.mp4',{type:'video',description:'{"title":"Really a nice place","introduction":"Never think it so easy"}'});
            reply = {
                type: 'video',
                mediaId: data.media_id,
                title:'回复测试',
                description:'篮球'
            };
        }else if(content == '10'){  /*上传永久素材测试*/
            /*上传永久图片*/
            var picData = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg',{});
            var media = {
                articles:[{
                    title:'tututu',
                    thumb_media_id:picData.media_id,
                    author:'szy',
                    digest:'没有摘要',
                    show_cover_pic:1,
                    content:'没有内容',
                    content_source_url:'http://www.sooszy.com'
                }]
            }
            data = yield wechatApi.uploadMaterial('news', media, {});
            console.log('上传素材ID'+JSON.stringify(data))
            data = yield wechatApi.fetchMaterial(data.media_id,'news',{});

            var items = data.news_item;
            var news = [];
            items.forEach(function(item){
                news.push({
                    title:item.title,
                    description:item.digest,
                    picUrl:picData.url,
                    url:item.url
                })
            })
            reply = news;
        }else if(content == '11'){  /*获取素材数量方法测试*/
            var counts = yield wechatApi.countMaterial();
            console.log(JSON.stringify(counts))
            var list = yield wechatApi.batchMaterial({offest: 0, count: 10, type: 'image'});
            var list2 = yield wechatApi.batchMaterial({offest: 0, count: 10, type: 'video'});
            var list3 = yield wechatApi.batchMaterial({offest: 0, count: 10, type: 'news'});
            var list3 = yield wechatApi.batchMaterial({offest: 0, count: 10, type: 'voice'});
            console.log(list3)
        }else if(content == '12'){
            var group = yield wechatApi.createGroup('wechat');
            console.log('创建分组'+JSON.stringify(group))   //{"group":{"id":110,"name":"wechat"}}
            var groups = yield wechatApi.fetchGroup();
            console.log('获取分组'+JSON.stringify(groups))
            var group2 = yield wechatApi.createGroup(message.FromUserName);
            console.log('查看自己分组'+JSON.stringify(group2))
            reply = 'Group done!';
        }else if(content == '13'){  /*测试获取用户信息*/
            var user = yield wechatApi.fetchUsers(message.FromUserName);
            console.log('用户信息'+JSON.stringify(user))
            var openIds = [
                {
                    openid:message.FromUserName,
                    lang:'en'
                }
            ]
            var users = yield wechatApi.fetchUsers(openIds);
            console.log('用户信息数组'+JSON.stringify(users))
            reply = 'Users done!';
        }else if(content == '14'){  /*测试获取用户列表*/
            var userList = yield wechatApi.listUsers();
            console.log('用户列表信息'+JSON.stringify(userList))//用户列表信息{"total":1,"count":1,"data":{"openid":["oW_s7w9ip24kASqJV1ASti0u6jNU"]},"next_openid":"oW_s7w9ip24kASqJV1ASti0u6jNU"}

            reply = 'UserList done!';
        }else if(content == '15'){  /*测试分组群发*/
            var mpnews = {
                media_id:'GNihvM5UdatWdvwjDV5M3luid7kihudDepZLKra1bnA'
            }
            var msgData = yield wechatApi.sendByGroup('mpnews',mpnews)
            console.log(msgData)
            reply = '群发测试!';
        }else if(content == '16'){  /*测试openid群发*/
            var mpnews = {
                media_id:'GNihvM5UdatWdvwjDV5M3luid7kihudDepZLKra1bnA'
            }
            var msgData = yield wechatApi.sendByGroup('mpnews',mpnews)
            console.log(msgData)
            reply = '群发测试!';
        }else if(content == '17'){  /*测试预览群发*/
            var mpnews = {
                media_id:'GNihvM5UdatWdvwjDV5M3luid7kihudDepZLKra1bnA'
            }
            var msgData = yield wechatApi.previewMass('mpnews', mpnews, 'oW_s7w9ip24kASqJV1ASti0u6jNU');
            console.log(msgData)
            reply = '预览群发测试!';
        }else if(content == '18'){  /*创建二维码*/
            var tempQr = {
                expire_seconds: 40000,
                action_name: 'QR_SCENE',
                action_info: {
                    scene: {
                        scene_id: 123
                    }
                }
            };
            var permQr = {
                action_name:'QR_LIMIT_SCENE',
                action_info: {
                    scene: {
                        scene_id: 123
                    }
                }
            };
            var permSrtQr = {
                action_name:'QR_LIMIT_STR_SCENE',
                action_info: {
                    scene: {
                        scene_id: "abc"
                    }
                }
            };
            var qr1 = yield wechatApi.createQrcode(tempQr);
            var qr2 = yield wechatApi.createQrcode(permQr);
            var qr3 = yield wechatApi.createQrcode(permSrtQr);

            reply = '预览群发测试!';
        }else if(content == '19'){  /*测试预览群发*/
            var semanticData = {
                query:'寻龙决',
                city:'常州',
                category:'move',
                uid:message.FromUserName
            }
            var shortData = yield wechatApi.semantic(semanticData);
            console.log(JSON.stringify(shortData));
            reply = '预览群发测试!';
        }
        this.body = reply;
    }

    yield next
}