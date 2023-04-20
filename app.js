const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const admin = require('firebase-admin');
const credentials = require('./key.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials)
})

const db = admin.firestore();

app.post('/create', async (req, res) => {
    try {
        console.log(req.body)
        const id = req.body.email;
        const userJson = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };
        // const response = db.collection("users").doc(id).set(userJson);
        const response = db.collection("users").add(userJson);
        res.send(response);
    }
    catch (error) {
        res.send(error);
    }
});

app.get('/read/all', async (req, res) => {
    try {
        const userRef = db.collection('users');
        const response = await userRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    }
    catch (error) {
        res.send(error);
    }
})

app.get('/read/:id', async (req, res) => {
    try {
        const userRef = db.collection('users').doc(req.params.id);
        const response = await userRef.get();
        res.send(response.data());

    } catch (error) {
        res.send(error);
    }
})

app.post('/update', async (req, res) => {
    try {
        const id = req.body.email;
        const newFirstName = "hello world";
        const userRef = await db.collection('users').doc(id)
            .update({
                firstName: newFirstName
            });
        const response = await userRef.get();
        res.send(response.data());

    } catch (error) {
        res.send(error);
    }
})

app.get('/delete/:id', async (req, res) => {
    try {
        const userRef = await db.collection('users').doc(req.params.id).delete();
        const response = await userRef.get();
        res.send(response.data());

    } catch (error) {
        res.send(error);
    }
})




app.listen(3000, (req, res) => {
    console.log('App will running Successfully');
})
