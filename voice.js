let AWS = require('aws-sdk');
require("./auth.js");
let polly = new AWS.Polly();
let params = { "LanguageCode": 'en-US'};

polly.describeVoices(params,function(err,data){
	if(err){
		console.log(err);
	}else{
		console.log(data);
	}
})
