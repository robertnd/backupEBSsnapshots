var AWS = require('aws-sdk')

const s3 = new AWS.S3()
//CreateBucketConfiguration:{LocationConstraint: "us-east-1"}
var params = {
    Bucket:"robertnd-xddr"    
}

// s3.createBucket(params, function(err, data){
//     if (err) console.log(err, err.stack)
//     else console.log(data)
// })

s3.listBuckets(function(err, data) {
    if (err) console.log(err, err.stack)
    else console.log(data.Buckets)
})