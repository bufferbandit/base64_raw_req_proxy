var http = require('http');

var options = {
  host: 'localhost',
  port: 9000,
  path: '/static_request_emulator.php'
};

var req_data = {}
var headers = {}

http.get(options, function(res) {

	var b64body = '';
	res.on('data', function(chunk){b64body += chunk;});
	res.on('end', function() {
	
	//console.log(body);
	raw_req = Buffer.from(b64body, 'base64').toString()
	var req_lines = raw_req.split("\n")

	//console.log(req_lines)	
	for(let line of req_lines) {
		//console.log(line)
		var line_split = line.split(':')
		if(line_split.length > 1){
			var header_split = line.split(/:(.+)/)
			
			//console.log(header_split)
			var header_name = header_split[0].trim()
			var header_value = header_split[1]
		
			headers[header_name] = header_value		
			//console.log(header_value)
		} 
		else if(line_split.length == 1  && line_split != "" && line_split != "\r"){
			
			var url_split = line_split[0].split(/ (.+)/)
			
			
			if(url_split.length >=3){
				var method = url_split[0]
				var path = url_split[1].split(" ")[0]
				
				if(method == "GET"){
					var parameters = path.split("?")[1]
					var path = path.split("?")[0]
				}
			}
			else if(url_split.length == 1 && method == "POST" ){
				var parameters = url_split[0]
			}

			//console.log(url_split.length)	
			//console.log(url_split)
			//console.log(url)	

		}
	}

	
req_data["parameters"] = parameters
req_data["headers"] = headers
req_data["host"] = headers["Host"].trim()
req_data["path"] = path
req_data["method"] = method
req_data["url"] = headers["Host"].trim() + path


console.log(req_data)



})})
