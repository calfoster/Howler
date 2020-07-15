const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.getHowls = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection("howls")
    .get()
    .then((data) => {
      let howls = [];
      data.forEach((doc) => {
        howls.push(doc.data());
      });
      return res.json(howls);
    })
    .catch((err) => {
      console.error(err);
    });
});

exports.createHowl = functions.https.onRequest((req, res) => {
  const newHowl = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
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
