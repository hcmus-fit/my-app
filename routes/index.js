var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   const number = req.query.number;
//   res.render('index', { title: 'Express',
//       number: number,
//       result: number *number });
// });

// GET home page.
router.get('/', function(req, res) {
    res.redirect('/catalog');
});

router.post('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
