const { MongoClient } = require('mongodb');

const loginData = { login: { username: "pratham", email: "abc@gmail.com", password: "ptnsamnvd1" } };
const client = new MongoClient("mongodb+srv://pratham:ptnsamnvd1@cluster0.pstblii.mongodb.net/?retryWrites=true&w=majority")
async function run(loginData) {
    try {
        console.log("connecting");
        await client.connect();
        console.log("connected");
        await client.db("games").collection("users").insertOne({ username: loginData.login.username, email: loginData.login.email, password: loginData.login.password });
        const curosor = await client.db("games").collection("users").find({ username: loginData.login.username }).toArray();
        console.log(curosor);
    } finally {
        await client.close();
        console.log("disconnected")
    }
}

if (loginData) {
    run(loginData);
}
