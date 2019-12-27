// 引入七牛模块  
let qiniu = require("qiniu")
//要上传的空间名
let bucket = 'zhugeleilei';
let imageUrl = 'q2e11jdvp.bkt.clouddn.com'; // 域名名称
let accessKey = '7Kic_fNnax5tVvgQhIxDyzDmVXncFDdzqLkHdPa4'
let secretKey = 'd3HNm7zlDl8ArrTXpWs76yAQ05HBOCj0YF7q-meG'
let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

let options = {
   scope: bucket,
}
let putPolicy = new qiniu.rs.PutPolicy(options)
let uploadToken = putPolicy.uploadToken(mac)

let config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z2
let formUploader = new qiniu.form_up.FormUploader(config)

let putExtra = new qiniu.form_up.PutExtra()

// 文件上传
let uploadImg = function(fileName, localFile) {
    return new Promise((resolve, reject) => {
        formUploader.putFile(uploadToken, fileName, localFile, putExtra, function(respErr, respBody, respInfo) {
            if (respErr) {
                console.log(JSON.stringify({status:'-1',msg:'上传失败',error:respErr}))  
            }
            if (respInfo.statusCode == 200) {
                let imageSrc ='http://'+ imageUrl +'/'+ respBody.key;
                console.log(JSON.stringify({status:'200',msg:'上传成功',imageUrl:imageSrc}))
                resolve(imageSrc)
            } else {
                console.log(JSON.stringify({status:'-1',msg:'上传失败',error:JSON.stringify(respBody)}))
            }
        })
    })
}


exports.uploadImg = uploadImg