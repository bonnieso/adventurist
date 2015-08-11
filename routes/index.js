var express = require('express');
var mongoose = require('mongoose');
var User = require('../app/user');
var Guide = require('../app/guide');
var router = express.Router();

router.patch('/user', function(req, res, next) {
  console.log("backend", req.body);
  var update = {
    name: req.body.user.name,
    location: req.body.user.location,
    bio: req.body.user.bio
  };
  User.findOneAndUpdate({
    _id: req.body.userId
  }, update, {
    new: true
  }, function(err, updatedUser) {
    console.log(err, updatedUser);
    if (err) {
      console.log(err);
      res.status(400).json({
        error: "Could not read user"
      });
    }
    if (!updatedUser) {
      res.status(404);
    }
    res.json(updatedUser);
  });
});

router.get("/user/:id", function(req, res) {
  console.log(req.params.id);
  User.findOne({
    _id: req.params.id
  }).exec(function(err, user) {
    if (err) {
      console.log(err);
      res.status(400).json({
        error: "Could not read user"
      });
    }
    if (!user) {
      res.status(404);
    }
    res.json(user);
  });
});


router.get('/allGuides', function(req, res) {
  Guide.find({}).sort({
    createdAt: 'desc'
  }).limit(100).exec(function(err, guides) {
    if (err) {
      console.log(err);
      res.status(400).json({
        error: "Could not get guides"
      });
    }
    res.json(guides);
  });
});

router.post('/guide', function(req, res) {
  var guide = new Guide(req.body);

  guide.location = req.body.city;
  guide.user = req.body.user;
  guide.guideName = req.body.guidename;
  guide.userName = req.body.username;

  guide.save(function(err, savedGuide) {
    if (err) {
      console.log(err);
      res.status(400).json({
        error: "Validation Failed"
      });
    }
    console.log("savedGuide: ", savedGuide);
    res.json(savedGuide);
  });
});

router.get('/guide/:id', function(req, res) {
  Guide.findOne({
    _id: req.params.id
  }).exec(function(err, guide) {
    if (err) {
      console.log(err);
      res.status(400).json({
        error: "Could not read guide"
      });
    }
    if (!guide) {
      res.status(404);
    }
    res.json(guide);
  });
});

router.patch('/guide/:id', function(req, res) {
  Guide.findOneAndUpdate({
      _id: req.params.id
    }, {
      $push: {
        "destinations": {
          name: req.body.name,
          url: req.body.url,
          address: req.body.address,
          photo: req.body.photo
        }
      }
    }, {
      safe: true,
      upsert: true
    },
    function(err, model) {
      console.log(err);
    }
  );
});

router.patch('/destination/:id', function(req, res) {
  console.log('delete destination ', req.body.id);
  Guide.findOneAndUpdate({
      _id: req.params.id
    }, {
      $pull: {
        "destinations": {
          _id: req.body.id
        }
      }
    }, {
      safe: true,
      upsert: true
    },
    function(err, model) {
      console.log(err);
    }
  );
});

router.patch('/user/:id', function(req, res) {
  User.findOneAndUpdate({
      _id: req.params.id
    }, {
      $push: {
        "favorites": {
          guidename: req.body.guidename,
          username: req.body.username,
          location: req.body.location,
          id: req.body.id
        }
      }
    }, {
      safe: true,
      upsert: true
    },
    function(err, model) {
      console.log(err);
    }
  );
});

router.delete('/guide/:id', function(req, res) {
  console.log(req.params.id);
  Guide.findOneAndRemove({
    _id: req.params.id
  }, function(err, removedGuide) {
    console.log(err, removedGuide);
    if (err) {
      console.log(err);
      res.status(400).json({
        error: "Could not remove guide"
      });
    }
    if (!removedGuide) {
      res.status(404);
    }
    res.json({
      message: 'guide removed'
    });
  });
});

module.exports = router;
