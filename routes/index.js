var router = require('express').Router();

router.get('/', function(req,res) {
	res.render('index', {title:'Visual File System'});
});

module.exports = router;
