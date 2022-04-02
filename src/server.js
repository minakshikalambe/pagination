const app = require("./index");

const connect = require("./configs/db");

app.listen(5008, async function () {
  await connect();
  console.log("listening on port 5008");
});