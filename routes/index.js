var express = require('express');
var router = express.Router();
var yelp = require("yelp").createClient({
  consumer_key: "kHfna7MJ-tSkoU2n7dJ2vA", 
  consumer_secret: "L3lCmyeXViDMflKz1bz1KtS-hMA",
  token: "jF0pu05_bmwjW-rdIqbmd_8LL6-GdvpZ",
  token_secret: "G7HgAH2g0Zcy6daVHD6NWBw64pk"
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/yelp', function(req, res, next) {
	yelp.search({location: req.query.location}, function(err, data) {
	  if(err) {
	  	res.send(err);
	  } else {
	  	res.send(data);
	  }
	});
})

module.exports = router;
