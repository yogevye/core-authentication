const mongoose = require('mongoose')

async function connect() {
    await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
}

connect();