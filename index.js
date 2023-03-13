const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
require('dotenv').config()


mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Database Connected Succesfully!")
}).catch((err) => {
  console.log(err);
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  }
})

const exerciseSchema = new mongoose.Schema({
  user_id:{
    type:String,
    required:true  
  },
  description:{
    type:String,
    required:true
  },
  duration:{
    type:Number,
    required:true
  },
  date:{
    type:Date,
    required:true
  }
})

let User = new mongoose.model('User', userSchema);

let Exercise = new mongoose.model('Exercise',exerciseSchema);
const findUsers = async (name = '') => {
  //Request for all users
  if (!name) {
    let users = await User.find({});
    // console.log(users);
    return users;
  }
  let users = await User.find({ username: name });
  // console.log(users);
  return users;
}

const createUser = async (name) => {
  const newUser = await User.create({ username: name });
  newUser.save();
  return newUser;
}

const findExercise = async () => {
  
}

const createExercise = async (user_id,description,duration,date) => {
  const newExercise= await User.create({
    user_id:user_id,
    description:description,
    duration:duration,
    date: new Date(date)
  })
  console.log('new Exercise created');
  return newExercise;
}

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', async (req, res) => {
  let allUsers = await findUsers();

  console.log("Inside get request")
  console.log(allUsers);
  res.send(allUsers)
})

app.post('/api/users', bodyParser.urlencoded({ extended: false }), async (req, res) => {
  let postedUserName = req.body.username;
  console.log("inside post request");
  // console.log(postedUserName);

  //getting the user if exist
  let myUser = await findUsers(postedUserName);

  if (myUser.length == 0) {
    //No user exist. create one!
    myUser = await createUser(postedUserName);
    console.log(myUser);
  } else {
    myUser = myUser[0];
  }

  res.json({
    username: myUser.username,
    _id: myUser._id
  })
});


app.post('/api/users/:_id/exercises',bodyParser.urlencoded({ extended: false }),async (req,res)=>{
  let postedData=req.body;
  console.log(postedData[':_id']);
  res.json(postedData);
})








const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
