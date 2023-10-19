const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.handler = async (event, context) => {
  try {
    const s3Event = event.Records[0].s3;
    const bucketName = s3Event.bucket.name;
    const objectKey = s3Event.object.key;

    // Check if the uploaded object is a ZIP file
    if (!objectKey.endsWith('.zip')) {
      console.log(`Object '${objectKey}' is not a ZIP file. Skipping update.`);
      return;
    }

    const lambdaMap = new Map();
    //TODO: Update this map with the zip file name and lambda function name
    //lambdaMap.set('deployment.zip', 'lambda-function-name');

    // Create a new Lambda function version
    const updateFunctionParams = {
      FunctionName: lambdaMap.get(objectKey),
      S3Bucket: bucketName,
      S3Key: objectKey,
    };

    const updatedFunction = await lambda.updateFunctionCode(updateFunctionParams).promise();

    console.log(`Lambda function updated with new code: ${updatedFunction.FunctionArn}`);
  } catch (error) {
    console.error('Error updating Lambda function:', error);
    throw error;
  }
};