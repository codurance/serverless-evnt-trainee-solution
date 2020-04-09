
# Have serverless deploying a event bridge

## DoD:
 I can throw an event and listen to it

## Tips:

- Hello world command:
    sls create --template aws-nodejs --path myService



- you need a template for the json
    aws events put-events --generate-cli-skeleton          


- you need to send 
    aws events put-events --entries fileb://firstEvent.json

{
   "Version": "2012-10-17",
   "Statement": [
      {
         "Sid": "CloudWatchEventsFullAccess",
         "Effect": "Allow",
         "Action": "events:*",
         "Resource": "*"
      },
      {
         "Sid": "IAMPassRoleForCloudWatchEvents",
         "Effect": "Allow",
         "Action": "iam:PassRole",
         "Resource": "arn:aws:iam::*:role/AWS_Events_Invoke_Targets"
      }      
   ]
}


{
   "Version": "2012-10-17",
   "Statement": [
      {
         "Effect": "Allow",
         "Principal": {
            "Service": "events.amazonaws.com"
         },
         "Action": "sts:AssumeRole"
      }
   ]
}
