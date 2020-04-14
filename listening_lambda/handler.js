'use strict';

const aws = require('aws-sdk')
const parse = aws.DynamoDB.Converter.output;
const ddb = new aws.DynamoDB({ apiVersion: '2012-08-10'})
const docClient = new aws.DynamoDB.DocumentClient()

module.exports.hello = async event => {
  console.log(event)
  console.log(event.detail)
  var body = event.detail
  var params = {
    TableName: 'posts',
    Key: {
      userId: body.userId
    },
    UpdateExpression: "SET #posts  = list_append(#posts, :post)",
    ExpressionAttributeNames: { "#posts" : "posts"},
    ExpressionAttributeValues: {":post": [event.detail]},
    ReturnValues : "UPDATED_NEW"

  }

  return await new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      console.log("@ docClient update")
      if (err) {
        console.log("Error", err)
        reject()
      } else {
        console.log("I got a response ")
        const response = {
          statusCode: 200,
          body: JSON.stringify(
            parse({ "M": data.Item}).posts,
            null,
            2
          )
        }
        console.log(response);
        return callback(null, response)
      }
    })
  })
};
