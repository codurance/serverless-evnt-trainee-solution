'use strict';

const aws = require('aws-sdk')
const parse = aws.DynamoDB.Converter.output;
const ddb = new aws.DynamoDB({ apiVersion: '2012-08-10'})
const docClient = new aws.DynamoDB.DocumentClient()

module.exports.createPost = async event => {
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

  return await docClient.update(params).promise()
};

module.exports.materialize = async event => {
  console.log("Materialize event", event);
  var post = event.detail
  console.log(post)
};
