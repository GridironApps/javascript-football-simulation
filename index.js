const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();


app.use(express.static(__dirname));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(PORT, function () {
    console.log(`Listening on ${PORT}`);
}); 

