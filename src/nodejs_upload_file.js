var http = require('http');
var fs = require('fs');
var formidable = require('formidable');

const gun = require('gun')();
const hub = require('gun/lib/hub'); 


 
// html file containing upload form
var upload_html = fs.readFileSync("upload_file.html");
 
// replace this with the location to save uploaded files
//remember the / at the end!!
// !!!!!!! replace xyz with your local path, this will NOT work otherwise
var upload_path = "xyz/hubby/temphome/";
 
http.createServer(function (request, response) {
    if (request.url == '/uploadform') {
        response.writeHead(200);
        response.write(upload_html);

      return response.end();
    } else if (request.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(request, function (err, fields, files) {
            // oldpath : temporary folder to which file is saved to
            var oldpath = files.filetoupload.path;

            var newpath = upload_path + files.filetoupload.name;

            var shortName = files.filetoupload.name
            
            console.log("gogogo")



  



            // copy the file to a new location
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;


                console.log("go")
    

                // you may respond with another html page
                response.write('File uploaded and moved!' + "you uploaded:" + shortName);
       


                hub.watch(`./temphome`);
                gun.get("hub").on(data => {
                    response.write(data[`/temphome/${shortName}`]) // Get the content of index.html
                })
                
             
             //then store under hash
             //then flush out temphome
 

                response.end();
            });
        });
    } 
}).listen(8086);
