const express = require('express')
const userRouter = require('./routers/user/user')
const bodyParser = require('body-parser');

const port = process.env.PORT
require('./db/db')

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})