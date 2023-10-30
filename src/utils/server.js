const express = require("express");
const {value: config} = require("./config");
app = express()

app.use(express.urlencoded({extended: true, limit: "10mb"}));
app.use(express.json({extended: true, limit: "10mb"}));


app.listen(config.connect.port, () => {
    console.log(`Example app listening on port ${config.connect.port}`)
})


module.exports = app;

