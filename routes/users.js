'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const User = require('../models/user');

const router = express.Router();
router.use(bodyParser.json());
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

/*============ GET SINGLE USER ==============*/
router.get('/:id', (req, res, next) => {
  let userId = req.params.id;
  User.findById(userId)
    .then(result => {
      res.json(result);
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
  let{ note, score, handsPlayed } = req.body;
  console.log(req.body);
  let userId = req.params.id;
  let session = {
    score: score,
    handsPlayed: handsPlayed,
    note: note,
    date: Date.now()
  };
  User
    .findByIdAndUpdate(userId, {$push: {sessions: session}, note})
    .exec()
    .then(userSession => {
      res.json({
        sessions: userSession
      });
    })
    .catch(err => (next(err)));
    
});

module.exports = router;