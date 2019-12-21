const express = require('express');
const app = express();

const PORT = 3000;

const api = require('./api-service');

app.get('/api/users', api.users);
app.get('/api/users/:userID/friends', api.friends);
app.get('/api/users/:userID/fof', api.friendsOfFriends);
app.get('/api/users/:userID/suggested', api.suggestedFriends);

app.listen(PORT, () => { console.log(`Listening on port: ${PORT}`) });