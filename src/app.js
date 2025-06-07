const express = require("express");

const app = express();

app.use((req, res) => {
    res.send("From server with defined port 3000");
});

app.listen(3000, () => {
    console.log("Hello world");
});
