'use strict';

const express = require('express');

const User = require('../models/user');

const router = express.Router();

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {

  User.find()
    .sort('name')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', (req, res, next) => {


  // Username and password were validated as pre-trimmed
  let { username, password } = req.body;
  // console.log(req.body);
  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest
      };
      // console.log(newUser);
      return User.create(newUser);
    })
    .then(result => {
      return res.status(201).location(`/api/users/${result.id}`).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
});



/*=============== PUT/UPDATE USER ============*/
router.put('/:id', (req, res, next) => {
  let{ note, score } = req.body;
  let userId = req.params.id;
  let session = {
    score: score,
    date: Date.now()
  };
  // let notes = "this is a note";
  // let newData = {notes, session};
  User
    .findByIdAndUpdate(userId, {$push: {sessions: session}, note})
    .exec()
    .then(userSession => {
      res.json({
        sessions: userSession
      });
    })
    .catch(err => ((err)));
    
});

module.exports = router;