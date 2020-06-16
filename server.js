const express = require('express');

const app = express();

app.get('/', (req, res) => res.send('API Running'))

// if there is no environment variable set - PORT will default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at Port ${PORT}`))