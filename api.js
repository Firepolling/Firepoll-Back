const express = require('express');
const multer = require('multer');
const cors = require('cors');
const nanoID = require('nanoid')
const app = express()
const port = 8000

const data = multer()

app.use(express.json());
app.set('trust proxy', true)

app.use(cors({ origin: '*', credentials: true }));


let currentPolls = {}
let ip_log = {}

 
// Every X hours, filter all the current polls in order to manage memory
 const cut = setInterval(()=>{
	let keys= Object.keys(currentPolls) // get all keys
	let newPolls = {} // new polls to return
	let newLogs = {} // new logs to return
	 for(k in keys) // for each key in the collection
	{
		currentPolls[keys[k]].Life += 1;
		if(currentPolls[keys[k]].Life > 1)
		{
			console.log(`Removed ${currentPolls[keys[k]]}}`)
			
		}
		else // if not out of lifespan then add to new array
		{
			newPolls[keys[k]]= currentPolls[keys[k]];
			newLogs[keys[k]] = ip_log[keys[k]];
		}
	}
	currentPolls = {...newPolls} // set old to new
	ip_log = {...newLogs} // set old to new
},1000*60*60*6) // poll has lifetiem of 6 hours atleast





app.post('/createpoll',data.none(),(req,res)=>{
	let votes = []
	for(let x = 0;x<req.body.Options.length;x++){
		votes.push(0) // create an empty array to hold vote data
	}
	id = nanoID.nanoid()
	currentPolls[id] = {"Title":req.body.Title,"Options":req.body.Options,"Vote":votes,Life:0};
	ip_log[id] = []; // create an empty list to track ips
	res.status(200).send(id)
})

app.get('/getPoll',data.none(),(req,res)=>{
	const keyList = Object.keys(currentPolls); // get all keys for current polls
	if(keyList.includes(req.query.pollID)){ // check if poll id is valid
		res.status(200).send(currentPolls[req.query.pollID]) // return the data back to the request
	}
	else
	{
		res.status(400).send() //return valid request but invalid parameters
	}
	
})

app.post('/vote',(req,res)=>{
	var ip = req.headers['x-real-ip'] || req.connection.remoteAddress; // get the ip of the request
	const {pollID,Choice} = req.query
	if(!ip_log[pollID].includes(ip)) // if the users ip is not already requested on the poll
	{
		currentPolls[pollID].Vote[Choice] = currentPolls[pollID].Vote[Choice] +1 // add vote to counter
		ip_log[pollID].push(ip) // add ip to list of ips that voted
	}
	
	res.status(200).send()
})

// app.get('/test',(req,res)=>{
// 	var ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
// 	console.log(ip)
// 	res.status(200).send(ip)
// })


app.listen(port, () => console.log(`Live on http://localhost:${port}`))