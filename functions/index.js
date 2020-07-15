const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const express = require("express");
const { request } = require("express");
const app = express();

app.get("/howls", (req, res) => {
  admin
    .firestore()
    .collection("howls")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let howls = [];
      data.forEach((doc) => {
        howls.push({
          howlId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(howls);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post("/howls/new", (req, res) => {
  const newHowl = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };

  admin
    .firestore()
    .collection("howls")
    .add(newHowl)
    .then((doc) => {
      return res.json({ message: `Document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
});

exports.api = functions.https.onRequest(app);

// To emulate your functions: Run firebase emulators:start
