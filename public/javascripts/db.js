let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017/';

/**
 * 
 * @param {表名} table_name 
 * @param {插入数据} data 
 */
let add = function(table_name, data) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        let dbo = db.db("myApp");
        let obj = {}
        for(let i in data) {
            obj[i] = data[i]
        }
        dbo.collection(table_name).insertOne(obj, function(err, res) {
            if (err) throw err;
            console.log("文档插入成功");
            db.close();
        });
    });
}

/**
 * 
 * @param {表名} table_name 
 * @param {查询条件} data 
 */
let search = function(table_name, data, returnKey) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
            if (err) throw err
            let dbo = db.db("myApp")
            let obj = {}
            for(let i in data) {
                obj[i] = data[i]
            }
            dbo.collection(table_name).find(obj, {projection:returnKey}).toArray(function(err, result) {
                if (err) throw err
                db.close()
                resolve(result)
            });
        });
    }) 
}

let delete_ =  function(table_name, whereObj) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("myApp");
            dbo.collection(table_name).deleteOne(whereObj, function(err, result) {
                if (err) throw err;
                console.log("文档删除成功");
                db.close();
                resolve(result)
            });
        });
    })
}

/**
 * 
 * @param {表名} table_name 
 * @param {查询条件} whereObj 
 * @param {更新的数据} updateObj 
 */
let update = function(table_name, whereObj, updateObj) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db("myApp");
            let updateStr = {$set: updateObj};
            dbo.collection(table_name).updateMany(whereObj, updateStr, function(err, result) {
                if (err) throw err;
                console.log("文档更新成功");
                db.close();
                resolve(result)
            });
        });
    })
}

let update_1 = function(table_name, whereObj, updateObj) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
            if (err) throw err;
            let dbo = db.db("myApp");
            let updateStr = {$addToSet: updateObj};
            dbo.collection(table_name).updateMany(whereObj, updateStr, function(err, result) {
                if (err) throw err;
                console.log("文档更新成功");
                db.close();
                resolve(result)
            });
        });
    })
}

exports.add = add
exports.search = search
exports.delete_ = delete_
exports.update = update
exports.update_1 = update_1