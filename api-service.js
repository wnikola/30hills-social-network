const fs = require('fs');
const DATA = 'data.json';

let data = fs.readFileSync(DATA);
let users = JSON.parse(data);

exports.users = (req, res) => {
  res.status(200).send({
    success: true,
    users: users
  });
}

const getFriends = (id) => {
  return users.find(user => user.id == id).friends;
}

exports.friends = (req, res) => {
  if (!req.params.userID) {
    res.status(404).send({
      success: false,
      message: 'User not specified'
    });
    return;
  }

  if (!users.find(user => user.id == req.params.userID)) {
    res.status(404).send({
      status: false,
      message: 'User not found'
    });
    return;
  }

  let friends = getFriends(req.params.userID);

  res.status(200).send({
    status: true,
    friends: friends.map(id => users.find(user => user.id == id))
  });
}

exports.friendsOfFriends = (req, res) => {
  if (!req.params.userID) {
    res.status(404).send({
      success: false,
      message: 'User not specified'
    });
    return;
  }

  if (!users.find(user => user.id == req.params.userID)) {
    res.status(404).send({
      status: false,
      message: 'User not found'
    });
    return;
  }

  let friends = getFriends(req.params.userID);

  let friendsOfFriends = [...new Set(friends.flatMap(id => getFriends(id)).filter(id => id != req.params.userID && !getFriends(req.params.userID).includes(id)))];

  res.status(200).send({
    status: true,
    friendsOfFriends: friendsOfFriends.map(id => users.find(user => user.id == id))
  });
}

exports.suggestedFriends = (req, res) => {
  if (!req.params.userID) {
    res.status(404).send({
      success: false,
      message: 'User not specified'
    });
    return;
  }

  if (!users.find(user => user.id == req.params.userID)) {
    res.status(404).send({
      status: false,
      message: 'User not found'
    });
    return;
  }

  let friends = getFriends(req.params.userID);

  let suggestedFriends = [...new Set(friends.flatMap(id => getFriends(id)).filter((id, i, arr) => id != req.params.userID && !getFriends(req.params.userID).includes(id) && arr.indexOf(id) !== i))];

  if (suggestedFriends.length > 0) {
    res.status(200).send({
      status: true,
      suggestedFriends: suggestedFriends.map(id => users.find(user => user.id == id))
    });
  } else {
    res.status(404).send({
      status: false,
      message: `User doesn't have any suggested friends`
    });
  }
}