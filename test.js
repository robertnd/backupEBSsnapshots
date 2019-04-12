const AWS = require('aws-sdk')
const uuid = require('uuid')

var creds = new AWS.SharedIniFileCredentials({profile: 'admin'})
AWS.config.credentials = creds
console.log(creds)