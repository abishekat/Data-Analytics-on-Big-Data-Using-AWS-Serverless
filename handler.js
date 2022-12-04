'use strict';
/**
 * Author:      Abishek Arumugam Thiruselvi, Kausthuba
 * Created:     15 October 2022
 * Description: Programming on Cloud Assignment
 * Platforms:   AWS Lambda, API Gateway, Serverless, CodeCommit, CodeBuild, CodePipeline, Colud Formation, S3
 * Unit Testing:     AWS Lambda, Postman, Sereverless-Offline
 * 
 * (c) Copyright by Concordia University
 **/
 const AWS = require('aws-sdk');
 const structjson = require('structjson');
 const protobuf = require('protobufjs');
 const jwtDecode = require('jwt-decode');
 
 AWS.config.update({
     region: 'us-east-1'
 });
 
 const s3 = new AWS.S3();
 const BUCKET = process.env.BUCKET;
 
 module.exports.index = async (event) => {
     try {
 
         const file = JSON.parse(event.body);
 
         if (file.jwt != "") {
 
             const jwtDecoded = jwtDecode(file.jwt);
             console.log("JWT DECODED ::: " + JSON.stringify(jwtDecoded));
 
         }
 
 
         const value = file.Key;
         console.log("bucket:" + BUCKET + " " + "fileName: " + value);
 
         // JWT decoding
 
 
         let params = {
             Bucket: BUCKET,
             Key: value
         };
 
 
         // PROTOBUS JSON ENCODING
 
         const root = await protobuf.load('./userpackage.proto');
 
         const prams = root.lookupType('userpackage.parameters');
 
         const buf = prams.encode(file).finish();
         console.log(buf);
 
         const resp = {
             statusCode: 200,
             headers: {
                 'Content-Type': 'application/x-protobuf'
             },
             body: buf.toString('base64'),
             isBase64Encoded: true
         };
 
         console.log("encoded ::: " + JSON.stringify(resp))
 
 
         // Slicing the data
 
         const data = await s3.getObject(params).promise();
         const dataJsonArray = JSON.parse(data.Body);
 
         const batchUnit = file.requestParams.batchUnit ? file.requestParams.batchUnit : 10;
         const batchSize = file.requestParams.batchSize ? file.requestParams.batchSize : 1;
         const batchId = file.requestParams.batchId ? file.requestParams.batchId : 1;
         const reqWfId = file.requestParams.rwfID;
         const wlMetric = file.workLoadMetric;
 
 
         const startLimit = (batchId) * batchUnit;
         const endLimit = (startLimit + (batchSize * batchUnit));
         const resultData = dataJsonArray.slice(startLimit, endLimit);
         const totalBatches = dataJsonArray.length / batchUnit;
 
         console.log("startLimit  " + startLimit + "end Limit  " + endLimit + "batch Size  " + batchSize + "result length  " + resultData.length +
             "total batch " + totalBatches);
 
         console.log(JSON.stringify(resultData));
 
         console.log(" wlMetric :::   " + wlMetric + "   ");
 
         let filteredData = [];
         resultData.map((record, index) => {
             filteredData[index] = {
                 [wlMetric]: record[wlMetric]
             };
         });
 
         console.log("filteredData ::: " + JSON.stringify(filteredData));
         let sum = 0;
 
 
         switch (wlMetric) {
             case 'CPUUtilization_Average':
                 filteredData.forEach((item) => {
                     sum = sum + parseFloat(item.CPUUtilization_Average);
                     // console.log("sum CPUUtilization_Average:::"+sum);
                 });
                 break;
             case 'NetworkIn_Average':
                 filteredData.forEach((item) => {
                     sum = sum + parseFloat(item.NetworkIn_Average);
                     // console.log("sum NetworkIn_Average:::"+sum);
                 });
                 break;
             case 'NetworkOut_Average':
                 filteredData.forEach((item) => {
                     sum = sum + parseFloat(item.NetworkOut_Average);
                     // console.log("sum NetworkOut_Average:::"+sum);
                 });
                 break;
             case 'MemoryUtilization_Average':
                 filteredData.forEach((item) => {
                     sum = sum + parseFloat(item.MemoryUtilization_Average);
                     // console.log("sum MemoryUtilization_Average:::"+sum);
                 });
                 break;
             case 'Final_Target':
                 filteredData.forEach((item) => {
                     sum = sum + parseFloat(item.Final_Target);
                     // console.log("sum Final_Target:::"+sum);
                 });
                 break;
             default:
                 console.log("workload metric is not a valid string");
         }
 
 
         let average = sum / (filteredData.length);
         console.log("Average :::" + average);
 
         let resultantData, responseBody;
         try {
             resultantData = {
                 "requestWorkFlowID": reqWfId,
                 "lastBatchID": endLimit - 1,
                 "data": resultData
             };
 
             console.log(JSON.stringify(resultantData));
 
             // Encoding result data with protobuf
 
             const slicedData = root.lookupType('userpackage.slicedData');
 
             const buffed = slicedData.encode(resultantData).finish();
 
             const respEncoded = {
                 statusCode: 200,
                 headers: {
                     'Content-Type': 'application/x-protobuf'
                 },
                 body: buffed.toString('base64'),
                 isBase64Encoded: true
             };
 
             console.log("encoded ::: " + JSON.stringify(respEncoded))
 
             const proto = structjson.jsonToStructProto(resultantData);
             console.log("Protobuff values of the output" + "::: " + JSON.stringify(proto))
 
             responseBody = {
                 "statusCode": 200,
                 "body": resultantData
             };
 
             console.log(JSON.stringify(responseBody));
 
         } catch (err) {
             console.log(err);
             responseBody = {
                 statusCode: err.statusCode ? err.statusCode : 400,
                 body: "Bad Request"
             };
         }
 
         return JSON.stringify(responseBody);
 
     } catch (err) {
         console.log(err);
         return {
             statusCode: err.statusCode ? err.statusCode : 500,
             body: JSON.stringify({
                 error: err.name ? err.name : "Exception",
                 message: err.message ? err.message : "Unknown Error"
             })
         };
     }
 };