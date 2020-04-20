'use strict';

const aws = require('aws-sdk')
const docClient = new aws.DynamoDB.DocumentClient()

module.exports.createPost = async event => {
  console.log(event)
  console.log(event.detail)
  var post = event.detail
  return addPost(post, post.userId, 'posts')
};

module.exports.materialize = async event => {
  console.log("Materialize event", event);
  var post = event.detail
  console.log(post)
  const followers = await getFollowers(post)
  var promises = []
  followers.forEach((follower, index) => { 
    promises.push(addToTimeline(follower, post))
  })
  return Promise.all(promises)
};


async function getFollowers(post) {
  var params = {
    TableName: 'followed',
    Key: {
      userId: post.userId
    },
    ProjectionExpression: 'followedBy'
  }

  const docClient = new aws.DynamoDB.DocumentClient()
  const result = await docClient.get(params).promise()
  return result.Item.followedBy
}

async function addToTimeline(follower, post) {
  console.log("Adding post to " + follower + "'s timeline")
  return addPost(post, follower, 'timeline')
}

async function addPost(post, user, table) {
  console.log("Inside addPost for ", post, user, table)
  var params = {
    TableName: table,
    Key: {
      userId: user
    },
    UpdateExpression: "SET #posts  = list_append(#posts, :post)",
    ExpressionAttributeNames: { "#posts" : "posts"},
    ExpressionAttributeValues: {":post": [post]},
    ReturnValues : "UPDATED_NEW"
  }

  console.log("addPost params", params)
  return await docClient.update(params).promise();

}