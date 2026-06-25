const express = require("express");
const cors = require("cors");

const sendLog = require("./logger");

const server = express();

server.use(cors());
server.use(express.json());

server.get("/", async (request, response) => {
  try {
    await sendLog(
      "backend",
      "info",
      "api",
      "Home endpoint accessed"
    );

    response.status(200).json({
      status: "success",
      data: "Server is running"
    });
  } catch (err) {
    response.status(500).json({
      status: "error",
      message: "Something went wrong"
    });
  }
});

const PORT = 5000;

server.listen(PORT, async () => {
  console.log(`Application running on port ${PORT}`);

  await sendLog(
    "backend",
    "info",
    "startup",
    "Application launched successfully"
  );
});