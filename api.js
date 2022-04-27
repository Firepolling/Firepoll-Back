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

 const interval = setInterval(()=>{
     console.log(currentPolls)
 },10000) 

 const cut = setInterval(()=>{
	let keys= Object.keys(currentPolls)
	console.log(keys)
	let len = Object.keys(currentPolls).length;
	let newPolls = {}
	 for(k in keys)
	{
		currentPolls[keys[k]].Life += 1;
		if(currentPolls[keys[k]].Life > 1)
		{
			console.log(`Removed ${currentPolls[keys[k]]}}`)
		}
		else // if not out of lifespan then add to new array
		{
			newPolls[keys[k]]= currentPolls[keys[k]]
		}
	}
	currentPolls = {...newPolls}
},1000*60*60*8) // pool lives for 8 hours atleast






app.get('/',(req,res) => {
	res.status(200).send("Connection Valid")
})




app.post('/createpoll',data.none(),(req,res)=>{
	let votes = []
	for(let x = 0;x<req.body.Options.length;x++){
		votes.push(0)
	}
	id = nanoID.nanoid()
	currentPolls[id] = {"Title":req.body.Title,"Options":req.body.Options,"Vote":votes,Life:0};
	console.log(currentPolls[id])
	res.status(200).send(id)
})

app.get('/getPoll',data.none(),(req,res)=>{
	const keyList = Object.keys(currentPolls);
	if(keyList.includes(req.query.pollID)){
		res.status(200).send(currentPolls[req.query.pollID])
	}
	else
	{
		res.status(400).send()
	}
	
})

app.post('/vote',(req,res)=>{
	const {pollID,Choice} = req.query
	currentPolls[req.query.pollID].Vote[Choice] = currentPolls[req.query.pollID].Vote[Choice] +1
	console.log(currentPolls[req.query.pollID])
	
	res.status(200).send()
})

app.get('/test',(req,res)=>{
	console.log(req.header('x-forwarded-for'))
	res.status(200).send(req.header('x-forwarded-for'))
})


app.listen(port, () => console.log(`Live on http://localhost:${port}`))