var AWS = require('aws-sdk')
const ec2 = new AWS.EC2({region: 'us-east-1'})

exports.handler = async (event, context) => {   
   var params = { DryRun: false }
   
   console.log('INVOKING ...')
   
    
   var result = await ec2.describeInstances(params, function (err, data) {
       if (err) console.log("ThaDamnCallFailed")
       else {
           for (var r = 0; r < data.Reservations.length; r++) {
               for (var i = 0; i < data.Reservations[r].Instances.length; i++) {
                   createSnapshots(data.Reservations[r].Instances[i])
            }
        }
       }
   }).promise()
   
   console.log("Success", JSON.stringify(result))
   //return result
}

function getInstanceVolumes(instance) {
    var volumes = []
    for (var i = 0; i < instance.BlockDeviceMappings.length; i++) {
        volumes.push(instance.BlockDeviceMappings[i].Ebs.VolumeId)
    }
    return volumes
}

function createSnapshots(instance) {
    var volumes = getInstanceVolumes(instance);

    for (var v = 0; v < volumes.length; v++) {
        console.log('Creating snapshot for volumeId ' + volumes[v])
       var params = {
            VolumeId: volumes[v],
            DryRun: false
        }
        ec2.createSnapshot(params, function (err, data) {
            if (err) console.log(err, err.stack)
            else console.log(data)
        })
    }
}
