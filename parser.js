var md5 = require('MD5');
var docparser = function(root_url){
	this.root_url = "http://" + root_url;
}
docparser.prototype.parseTokens = function(doc){
	var temp = JSON.stringify(doc);
	temp = temp.replace(/<URI>/g, this.root_url);


	temp = temp.replace(/<ETAG>/g, md5(temp));
	return JSON.parse(temp);
};

module.exports = docparser;