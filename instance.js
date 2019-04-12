var AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
const ec2 = new AWS.EC2()

var params = { DryRun: false }
var instances = []
var volumes = []

//this thing doesn't work from Lambda
// ...
ec2.describeInstances(params, function (err, data) {
    if (err) console.log(err, err.stack)
    else {
        for (var r = 0; r < data.Reservations.length; r++) {
            for (var i = 0; i < data.Reservations[r].Instances.length; i++) {
                //console.log(data.Reservations[r].Instances[i])
                volumes.push(getInstanceVolumes(data.Reservations[r].Instances[i]))
                instances.push(data.Reservations[r].Instances[i].InstanceId)
                createSnapshots(data.Reservations[r].Instances[i])
            }
        }
    }

    console.log(instances)
    console.log(volumes)

    //else console.log("Instances: ", JSON.stringify(data))
})

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


/*exports.handler = async (event) => {
    // TODO implement
    //var ec2 = new AWS.EC2();
    var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
    var params = { DryRun: false };
    
    console.log("dummy write");
    ec2.describeInstances(params, function(err, data) {
        if (err) console.log(err, err.stack)
        else console.log(JSON.stringify(data)
        }
    });

};
 */