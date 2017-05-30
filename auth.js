var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var cors = require('cors');

let AWS = require('aws-sdk');



AWS.config.loadFromPath('./creds.json');

let polly = new AWS.Polly();
// let AWS = require('aws-sdk');
let fs = require('fs') ;


var audio_path = "";
// var synthCB = 



var port = 4000;

app.use(cors());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({	extended:true}));

app.post('/createmp3',createMp3);

function createMp3(req,res){
	console.log("req.body",req.body);
	let params = {
	"OutputFormat":"mp3",
	// "Text":"Hello, my name is Arindam Banerjee",
	"TextType":"text",
	"VoiceId":"Salli"
	};
	params.Text = req.body.message;
	polly.synthesizeSpeech(params,function(err,data){
		if(err){
			console.log( err);
		}else{
			console.log(data);
			var ran = Math.floor((Math.random() * 100) + 1);
			var mp3name = "";
			if(req.body.name){
				mp3name = req.body.name;
			}else{
				mp3name = "mymp3"+ran;	
			}
			writeFile(mp3name,data.AudioStream,res);			
		}
	});
}
var filename = '';
function writeFile(fname,data,res) {
	filename = fname ;
  fs.writeFile("./audio/"+filename+".mp3", data, { flag: "wx" }, function(err) {
    if (err) {
      console.log("file " + filename+".mp3" + " already exists, testing next");
      filename = filename + "_0";
      writeFile(filename,data,res);
    }
    else {
    	audio_path ="audio/"+ filename+".mp3";
      console.log("Succesfully written " + filename+".mp3");
      res.json({message:"mp3 created",path:audio_path});
    }
  });

}

app.listen(port,function(){
	console.log("AWS server pointing : "+port);
})

