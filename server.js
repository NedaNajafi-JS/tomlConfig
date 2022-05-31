const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');
const path = require('path');

const app = express()
const port = process.env.PORT || 5003;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.dirname(require.main.filename) + '/src/modules/packages/statics'));

const packageAPIs = require('./src/modules/packages/packageRouter');

app.use('/', packageAPIs);

app.listen(port, () => console.log(`Server Running on port ${port}`))
