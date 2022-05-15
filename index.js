const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const http = require("http").createServer(app);
const routes = require("./routes");
var cors = require('cors')

app.use(cors());
http.listen(PORT, () => {
    console.log(`Listening at PORT no - ${PORT}`);
});

app.use("/life_tracking", routes);