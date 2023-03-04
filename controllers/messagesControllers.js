const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");

const sendMessages = expressAsyncHandler(async (req, res) => {
  const { senderName, senderEmail, message } = req.body;
  if (!senderName || !senderEmail || !message) {
    res.status(500);
    throw new Error("Veuillez remplir tous les champs");
  }
  await Message.create({ senderName, senderEmail, message });
  res.status(200).send("Votre message a été reçu !");
});

const getMessages = expressAsyncHandler(async (req, res) => {
  const messages = await Message.find({});

  res.send(messages);
});

module.exports = { sendMessages, getMessages };
