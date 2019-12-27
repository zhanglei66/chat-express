let express = require('express');
let router = express.Router();
let fs = require('fs')
let formidable = require('formidable')
let db = require('../public/javascripts/db')


router.post('/login', function (req, res) {
	let tiaojian = {
		loginId: req.body.loginId
	}
	db.search('user', tiaojian).then((data) => {
		if (data.length == 1 && data[0].password == req.body.password) {
			let response = {
				errCode: '0',
				msg: '登录成功'
			}
			res.send(response)
		} else if (data.length == 1 && data[0].password != req.body.password) {
			let response = {
				errCode: '1001',
				msg: '密码错误'
			}
			res.send(response)
		} else if (data.length == 0) {
			let response = {
				errCode: '1002',
				msg: '您还没注册，请注册'
			}
			res.send(response)
		}
	})
})

router.post('/zhuce', function (req, res) {
    let tiaojian1 = {
        loginId: req.body.loginId
    }
    let tiaojian2 = {
        loginId: req.body.loginId,
        password: req.body.password,
        head_img: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
    }
    db.search('user', tiaojian1).then((data) => {
        if(data.length != 0) {
            let response = {
                errCode: '2001',
                msg: '该邮箱已被注册'
            }
            res.send(response);
        } else {
            db.add('user', tiaojian2)
            let response = {
                errCode: '0',
                msg: '注册成功'
            }
            res.send(response)
        }
    })
})

router.post('/clearUnread', function (req, res) {
    let whereObj = {
        sendId: req.body.sendId
    }
    let updateObj = {'sended': true}
    db.update('chat', whereObj, updateObj).then((data) => {
        let response = {
            errCode: 2000,
            msg: '更新成功',
            data: data
        }
        res.send(response)
    })
})

router.get('/getAllFriends', function(req, res) {
    db.search('user', {loginId: {$ne:req.query.loginId}}).then((data) => {
        let response = {
            errCode: '0',
            msg: 'success',
            data: data
        }
        res.send(response)
    })
})

router.get('/getfriends', function(req, res) {
    let tiaojian = {
        $or: [
            {receiveId: req.query.loginId},
            {sendId: req.query.loginId}
        ]
    }
    db.search('chat', tiaojian).then((data) => {
        if(data.length == 0) {
            let obj = {
                errCode: 1,
                msg: '无数据',
            }
            res.send(obj)
            return
        }
        let mySet = new Set()
        for(let i=0 ; i<data.length ; i++) {
            if (data[i].sendId == req.query.loginId) {
                mySet.add(data[i].receiveId)
            } else {
                mySet.add(data[i].sendId)
            }
        }
        let myArray = [...mySet]
        let condition = {
            $or: []
        }
        for(let i=0 ; i<myArray.length ; i++) {
            let obj = {
                loginId: myArray[i]
            }
            condition.$or.push(obj)
        }
        db.search('user', condition, {password: 0}).then((userData) => {
            let resData = userData
            for(let i=0 ; i<resData.length ; i++) {
                resData[i].notSendNum = 0
                for(let j=0 ; j<data.length ; j++) {
                    if( (resData[i].loginId == data[j].sendId) && data[j].sended == false ) {
                        resData[i].notSendNum++
                    }
                }
            }
            let response = {
                errCode: '0',
                msg: 'success',
                data: resData
            }
            res.send(response)
        }) 
    })
})

router.get('/getMsg', function(req, res) {
    let id1 = req.query.id1
    let id2 = req.query.id2
    let condition = {
        $or: [
            {
                sendId: id1,
                receiveId: id2
            },
            {
                receiveId: id1,
                sendId: id2
            }
        ]
    }
    db.search('chat', condition).then((data) => {
        let response = {
            errCode: '2000',
            msg: 'success',
            data: data
        }
        res.send(response)
    })
})

router.get('/getOneUser', function(req, res) {
    let condition = {
        loginId: req.query.id
    }
    db.search('user', condition, {password: 0}).then((data) => {
        let response = {}
        if(data.length == 0) {
            response.errCode = '-1'
            response.msg = 'not found'
        } else {
            response.errCode = '0'
            response.msg = 'success'
            response.info = data
        }
        res.send(response)
    })
})


router.post('/upload', function(req, res) {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        let imgName = fields.nowLoginId+'_'+(new Date())
        upload.uploadImg(imgName, files.file.path).then((src)=> {
            let id = fields.nowLoginId
            let obj = {
                loginId: id
            }
            let update = {
                head_img: src
            }
            fs.unlink(files.file.path, function(err) {
                if (err) {
                    return console.error(err);
                }
                console.log("文件删除成功！");
            });
            db.update('user', obj, update).then((response)=> {
                let resObj = {
                    errCode: 0,
                    msg: '更改成功',
                    src: src
                }
                res.send(resObj)
            })
        })
    })
})

module.exports = router;