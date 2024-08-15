const express = require('express')
const mongoose = require("mongoose")
const cors = require('cors')
let socket = require('socket.io')

const { usersRouter } = require('./controllers/user')
const { productsRouter } = require('./controllers/item')
const { categoriesRouter } = require('./controllers/catagories')
const { sessionsRouter } = require('./controllers/session')
const { biddingRouter } = require('./controllers/bidding')
const auctionRoutes = require('./routes/aution-routes')

// chatgpted
const app = express()
app.use(express.json())
const port = process.env.PORT || 3001
app.use(function (req, res, next){
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect('http://' + req.hostname + req.url);
  } else {
    next();
  }
});
console.log(process.env.SERVER_URL)
console.log(process.env.MONGODB_URI)

const path = require('path')
app.use(express.static(path.join(__dirname, 'client/build')))


var server = app.listen(port, () => {
    console.log('listening to port', port)
})
app.use(express.json())
//app.use('/public/uploads', express.static('public/uploads'));
app.use(cors())

app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/category', categoriesRouter)
app.use('/sessions', sessionsRouter)
app.use('/bidding', biddingRouter)
app.use('/api/auctions', auctionRoutes);


/*
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
  })
    */

console.log('connectted')
mongoose
  .connect("mongodb+srv://sembunsibani:sibani@cluster0.sbzce.mongodb.net/")
  .then(() => console.log("Connected To Database"))
  .then(() => {
    app.listen(5001);
  })
  .catch((err) => console.log(err));

io = socket(server);
// io.origins('http://localhost:3000/')
//console.log('io',server)

io.on('connection', (socket) => {
    console.log('socket id', socket.id);

    socket.on("join_room", (data) => {
        //console.log('room', room.id)
        socket.join(data.id);
        socket.broadcast.in(data.id).emit("new_user", data.name + " has joined");
        io.to(`${socket.id}`).emit('ADMIN_MSG', 'Admin : Welcome to Bidding');

        console.log('connected to room', data.id)
    });



});








