'use strict';

const aws = require('aws-sdk')

const handler = async (event, context, callback) => {
  console.log("GET-RECEIVED!",event)

  var body;
  try {
    body = JSON.parse(event.body)
  } catch (e) {
    body = event.body
  }
  
  const eventBridge = new aws.EventBridge({apiVersion: '2015-10-07'}); 
  await eventBridge.putEvents({
    Entries: [{
      Source: 'codurance.event2', //<-- CHANGE ME for codurance.post
      DetailType: 'CoduranceEvent', //<-- CHANGE ME for Post
      Detail: JSON.stringify(body)
    }]
  }, (err, data) => {
    if(err) console.log("ERROR", err.stack)
    else console.log(data)
  })
    
  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {"success": "event published"},
      null,
      2
    )
  }
  return callback(null, response)
}

const publish = handler

module.exports = { publish }