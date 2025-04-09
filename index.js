const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Replace this with your actual project ID
const projectId = "hope-paaf";

// ✅ Use forward slashes or escaped backslashes
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "C:/Users/Akshat/Desktop/HOPE_BACKEND/hope-paaf-f3d6075c75e3.json"
});

app.post("/chat", async (req, res) => {
  const message = req.body.message;
  const sessionId = uuid.v4();
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: "en-US"
      }
    }
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText });
  } catch (error) {
    console.error("Dialogflow error:", error);
    res.status(500).send("Dialogflow request failed");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});