const express = require('express');
const app = express();
const { getPullRequests } = require('./routes/pullRequests');

// Pull Requests API route
app.use('/api/pull_requests', getPullRequests);

app.listen(3000, () => console.log('Server is listening on port 3000'));
