
var http = require('http');


function proxy(from_address){

    
    to_host =  "oin876i7otnp.free.beeceptor.com"
    to_path = "/"
    to_port = "80"
    
    from__url_no_protocol = from_address.split("//")[1]
    from__domain_name = from__url_no_protocol.split("/")[0]
    from__path = "/" + from__url_no_protocol.split('/').slice(1).join('/');
    from__port = 80
    
    //server receiving the requests from
    var req1_options = {
    host: from__domain_name,
    port: from__port,
    path: from__path
    };

    var req_data = {}
    var req_headers = {}

    http.get(req1_options, function(res) {

        var b64body = '';
        res.on('data', function(chunk) {
            b64body += chunk;
        });
        res.on('end', function() {

            raw_req = Buffer.from(b64body, 'base64').toString()
            var req_lines = raw_req.split("\n")

            for (let line of req_lines) {
                var line_split = line.split(':')
                if (line_split.length > 1) {
                    var header_split = line.split(/:(.+)/)
                    var header_name = header_split[0].trim()
                    var header_value = header_split[1]
                    req_headers[header_name] = header_value
                } else if (line_split.length == 1 && line_split != "" && line_split != "\r") {

                    var url_split = line_split[0].split(/ (.+)/)

                    if (url_split.length >= 3) {
                        var method = url_split[0]
                        var path = url_split[1].split(" ")[0]

                        if (method == "GET") {
                            var parameters = path.split("?")[1]
                            var path = path.split("?")[0]
                        }
                    } else if (url_split.length == 1 && method == "POST") {
                        var parameters = url_split[0]
                    }
                }
            }

            
            host = req_headers["Host"].trim().split(":")[0]
            port = req_headers["Host"].trim().split(":")[1]    
            
            
            if (method == "GET") {
                var get_options = {
                    host: host,
                    port: host,
                    path: path + "?" + parameters,
                    headers: req_headers
                };
                http.get(get_options, function(res) {

                    var response = '';
                    res.on('data', function(chunk) {
                        response += chunk;
                    });
                    res.on('end', function() {
                        console.log(response);
                    })
                })

            } else if (method == "POST") {

                var post_options = {
                    host: host,
                    port: port,
                    path: path,
                    headers: req_headers,
                    method: "POST"
                }
                
                console.log(path)

                var req = http.request(post_options, function(res) {
                    res.setEncoding('utf8');
                    res.on('data', function(chunk) {
                        console.log('' + chunk);
                    });
                });

                req.on('error', function(e) {
                    console.log('problem with request: ' + e.message);
                });

                req.write(parameters);
                req.end();
            }

        })
    })
}
