const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { defineBoolean } = require("firebase-functions/v2/params");
const { defaultDatabase } = require("firebase-functions/v1/firestore");
const { MAX_NUMBER_USER_LABELS } = require("firebase-functions");
admin.initializeApp();

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.createContact = functions.https.onRequest(async (request, response) => {
  try {
    if (request.method !== "POST") {
      throw new Error("Not existing HTTP Method  for this path");
    }
    const body = request.body;
    if (
      body.nome == null ||
      body.cognome == null ||
      body.email == null ||
      body.telefono == null
    ) {
      throw new Error("I campi inseriti  sono errati");
    }
    if (typeof body.nome !== "string" || body.nome.length > 50) {
      throw new Error("Il nome inserito  è errato");
    }
    if (typeof body.cognome !== "string" || body.cognome.length > 50) {
      throw new Error("Il cognome inserito  è errato");
    }
    if (isNaN(body.telefono) || String(body.telefono).length > 10) {
      throw new Error("Il numero inserito è errato");
    }

    if (typeof body.email !== "string" || !body.email.includes("@")) {
      throw new Error("Email inserita è errata");
    }
    const result = await admin.firestore().collection("clienti").add(body);
    console.log(result);
    response.json(`Hai creato un contatto con id: ${result.id}`);
  } catch (error) {
    response.json("Exception: " + error.message);
  }
});

exports.getContactById = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== "GET") {
      throw new Error("Not existing HTTP Method Request for this path.");
    }

    const params = req.query;
    if (params.id == null) {
      throw new Error("Id is missing");
    }

    await admin
      .firestore()
      .collection("clienti")
      .doc(params.id)
      .get()
      .then((doc) => {
        const contact = doc.data();
        if (contact == null) {
          throw new Error("CONTACT_NOT_FOUND");
        }
        res.json(contact);
      });
  } catch (e) {
    res.json("Exception: " + e.message);
  }
});

exports.deleteContactById = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== "DELETE") {
      throw new Error("Not existing HTTP Method Request for this path.");
    }

    const params = req.query;
    if (params.id == null) {
      throw new Error("Id is missing");
    }

    await admin.firestore().collection("clienti").doc(params.id).delete();
  } catch (e) {
    res.json("Exception: " + e.message);
  }
});

exports.patchContactById = functions.https.onRequest(async (request, res) => {
  admin.firestore().settings({ ignoreUndefinedProperties: true });
  try {
    if (request.method !== "PATCH") {
      throw new Error("Not existing HTTP Method Request for this path.");
    }
    const body = request.body;
    if (body.nome != null) {
      if (typeof body.nome !== "string" || body.nome.length > 50) {
        throw new Error("Il nome aggiornato  è errato");
      }
    }
    if (body.cognome != null) {
      if (typeof body.cognome !== "string" || body.cognome.length > 50) {
        throw new Error("Il cognome aggiornato  è errato");
      }
    }

    if (body.telefono != null) {
      if (isNaN(body.telefono) || String(body.telefono).length > 10) {
        throw new Error("Il numero aggiornato è errato");
      }
    }

    if (body.email != null) {
      if (typeof body.email !== "string" || !body.email.includes("@")) {
        throw new Error("Email aggiornata è errata");
      }
    }

    const params = request.query;
    if (params.id == null) {
      throw new Error("Id is missing");
    }

    await admin.firestore().collection("clienti").doc(params.id).update({
      nome: body.nome,
      cognome: body.cognome,
      telefono: body.telefono,
      email: body.email,
    });
  } catch (e) {
    res.json("Exception: " + e.message);
  }
});
