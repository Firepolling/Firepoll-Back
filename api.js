const express = require('express');
const multer = require('multer');
const cors = require('cors');
const nanoID = require('nanoid')
const app = express()
const port = 8000

const data = multer()

app.use(express.json());


app.use(cors({ origin: '*', credentials: true }));


let currentPolls = {}

 const interval = setInterval(()=>{
     console.log(currentPolls)
 },10000) 






app.get('/',(req,res) => {
	res.status(200).send("Connection Valid")
	console.log("Test")
})

app.post('/postVote',(req,res) => {
	
	if(req.query.option == 1){
		numA++
	}
	else{
		numB++
	}
	res.status(200).send(`NumA:${numA}\nNumB:${numB}`)
})


app.post('/createpoll',data.none(),(req,res)=>{
	let votes = []
	for(let x = 0;x<req.body.Options.length;x++){
		votes.push(0)
	}
	id = nanoID.nanoid()
	currentPolls[id] = {"Title":req.body.Title,"Options":req.body.Options,"Vote":votes};
	//[req.body.Title,req.body.Options,votes]
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


app.listen(port, () => console.log(`Live on http://localhost:${port}`))