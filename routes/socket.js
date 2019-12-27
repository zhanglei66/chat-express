let express = require('express');
let router = express.Router();
let fs = require('fs')
let formidable = require('formidable')
let db = require('../public/javascripts/db')

let onlineUsers = new Map();

router.ws('/chatSocket', function (ws, req){
    if( !onlineUsers.has(ws) ) {
        onlineUsers.set(ws, req.query)
    }
    ws.on('message', function (msg) {
        console.log(msg)
        let msgg = JSON.parse(msg)
        if(msgg.type == 1) {
            onlineUsers.forEach(function(value, key, map) {
                if(value.id == msgg.receiveId) {
                    key.send(msg)
                }
            })
            let obj = {
                type: 1,
                sendId: msgg.sendId,
                receiveId: msgg.receiveId,
                agree: false
            }
            db.add('addFriend', obj)
            return
        }
        let target =0
        onlineUsers.forEach(function(value, key, map) {
            if(value.id == msgg.receiveId) {
                target = 1
                key.send(msg)
            }
        })
        if(target == 1) {
            let obj = {
                'sendId': msgg.sendId,
                'receiveId': msgg.receiveId,
                'msg': msgg.msg,
                'time': new Date(),
                'sended': true
            }
            db.add('chat', obj)
        } else {
            let obj = {
                'sendId': msgg.sendId,
                'receiveId': msgg.receiveId,
                'msg': msgg.msg,
                'time': new Date(),
                'sended': false
            }
            db.add('chat', obj)
        }
    })
    ws.on('close', function (msg) {
        console.log('有人断开了连接')
        onlineUsers.delete(ws)
    })
})

module.exports = router;