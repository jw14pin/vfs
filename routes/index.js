var router = require('express').Router()
var fs = require('fs')

router.get('/', function(req,res) {
	res.render('index', {title:'Visual File System'})
})

router.get('/fs', function(req,res){
	res.send(main1('./vfs'));
})

var main1 = function(path) {
	var jsonFS = {"name":path, "children":[]};
	readDir(path, jsonFS);
	var data = jsonFS;
	
	var test = function() {
		setInterval(function() {
			if (data === jsonFS) {
				return jsonFS;
			} else {
				test();
			}
			data = jsonFS;
		},1000)
	};
	
	test();
}


var readDir = function(path, jsonFS) {
	fs.readdir(path,function(err, items){
		items.forEach(function(item){
			fs.lstat(path + '/' + item, function(err, itemStat) {
				if (itemStat.isDirectory()) {
					jsonFS.children.push({"name":item,"children":[]})
					readDir(path + '/' + item, jsonFS.children[jsonFS.children.length -1]);
					
					// console.log('dir\t' + itemStat.size + '\t' + path + '/' + item)
				} else {
					jsonFS.children.push({"name":item, "size":itemStat.size})
					// console.log('file\t' + itemStat.size +'\t' + path + '/' + item)
				}
			});
		});
	});
};


module.exports = router;
module.exports.readDir = readDir;
module.exports.main1 = main1;
