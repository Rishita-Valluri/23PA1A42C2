const axios = require("axios");

async function sendLog(stackType, severity, moduleName, description) {
  try {
    const payload = {
      stack: stackType,
      level: severity,
      package: moduleName,
      message: description
    };

    const result = await axios({
      method: "POST",
      url: "http://4.224.186.213/evaluation-service/logs",
      data: payload,
      headers: {
        Authorization: "Bearer YOUR_ACCESS_TOKEN"
      }
    });

    console.log("Log submitted:", result.data);
    return result.data;
  } catch (error) {
    console.error("Unable to send log:", error.message);
    return null;
  }
}

module.exports = sendLog;