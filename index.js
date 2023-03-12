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

let User = new mongoose.model('User', userSchema);

const findUsers = async (name='') => {
  //Request for all users
  if(!name)
  { 
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

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', bodyParser.urlencoded({ extended: false }), async (req, res) => {
  let postedUserName = req.body.username;
  console.log(postedUserName);
  
  //getting the user if exist
  let myUser = await findUsers(postedUserName);
  
  if (myUser.length==0) {
    //No user exist. create one!
    myUser=await createUser(postedUserName);
    console.log(myUser);
  }
  else {
    console.log('user exist!');
    console.log(myUser);
  }
  
  res.json({
    username: myUser.username,
    _id: myUser._id
  })
});

// app.get('/api/users',async (req,res)=>{
//   let allUsers=await findUsers();
//   // console.log(allUsers);
//   res.send(allUsers)
// })







const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
