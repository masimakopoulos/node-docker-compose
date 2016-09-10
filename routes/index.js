'use strict';

const express = require('express');
const mongoose = require('../config/mongoose');
const router = express.Router();
const queue = require('../config/kue');
const Article = mongoose.model('Article');
let index = 0;

/* GET home page. */
router.get('/', (req, res, next) => {
  var newArticle = new Article({ title: 'myArticle' + index++ });
  newArticle.save(function (err) {
    if (err) {
      console.log(err);
    }
    console.log('added');
  });

  Article.find({}, (err, articles) => {
    if (err) return res.render('500');
    res.render('index', {
      title: 'Articles',
      articles: articles
    });
  });
  // create Kue job for stats processing
  queue.create('process_stats', {}).save();
});

module.exports = router;
