var express = require('express');
var router = express.Router();
let fs = require('fs')
let formidable = require('formidable')
let db = require('../public/javascripts/db')

/* GET users listing. */
router.get('/searchMyFriends', function (req, res, next) {
	let id = req.query.id
	let condition = {
		id: id
	}
	db.search('friends', condition).then(ress => {
		console.log(ress[0].friend_list.length)
		if(ress[0].friend_list.length == 0) {
			console.log('...........')
			let obj = {
				errCode: 1,
				msg: '无数据',
			}
			res.send(obj)
			return
		}
		let friend_list = ress[0].friend_list
		let condition1 = {
			$or: []
		}
		for(let i=0 ; i<friend_list.length ; i++) {
			let obj = { loginId: friend_list[i] }
			condition1.$or.push(obj)
		}
		db.search('user', condition1, {password: 0}).then(data => {
			let response = {
				errCode: 0,
				msg: '查询成功',
				info: data
			}
        	res.send(response)
		})
	})
});

router.get('/getFriendRequest', function(req, res, next) {
	let id = req.query.id
	let condition = {
		receiveId: id
	}
	db.search('addFriend', condition).then(ress => {
		let obj = {
			errCode: 0,
			msg: '查询成功',
			info: ress
		}
		res.send(obj)
	})
})

router.get('/acceptRequest', function(req, res, next) {
	let condition1 = {
		sendId: req.query.sendId,
		receiveId: req.query.receiveId
	}
	let condition2 = {
		id: req.query.receiveId
	}
	let updateObj2 = {
		friend_list: req.query.sendId
	}
	let condition3 = {
		id: req.query.sendId
	}
	let updateObj3 = {
		friend_list: req.query.receiveId
	}
	db.delete_('addFriend', condition1)
	db.update_1('friends', condition2, updateObj2)
	db.update_1('friends', condition3, updateObj3)
	let obj = {
		errCode: 0,
		msg: 'success',
	}
	res.send(obj)
})

module.exports = router;