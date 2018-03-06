var http = require("http");
var fs = require("fs");
var express = require("express");
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Ddos = require('ddos')
var parse = require('csv-parse');
var ddos = new Ddos;
var session = require('cookie-session');
app.use(ddos.express);

//######################## Variables ########################
var listen_port = 8080;
var serverUrl = "127.0.0.1";
var csvFile = "Corpus/corpus.csv";
var corpus=[];
var valeur = 0;

//######################## Init ########################

getCorpus();

app.use(session({
    cookieName: 'Annotation',
    secret: 'turlututuchapeaupointu ',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));
//######################## App.get ########################

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(err, res){
    var sess = err.session;
    sess.genre = "";
    sess.val = 0;
    var d = new Date();
    sess.nom = d.getTime();
    
    fs.readFile(__dirname + '/public/views/before.html', function(err, data){
        res.write(data);
        res.end();
    })
    //fs.createReadStream(__dirname + '/public/annotate.html', 'utf8').pipe(res);
});

app.get("/gender", function(err, res){
    var sess = err.session;
    fs.readFile(__dirname + '/public/views/gender.html', function(err, data){
        res.write(data);
        res.end();
    })
    //fs.createReadStream(__dirname + '/public/annotate.html', 'utf8').pipe(res);
});

app.get("/annotate", function(err, res){
    var sess = err.session;
    fs.readFile(__dirname + '/public/views/annotate.html', function(err, data){
        res.write(data);
        res.end();
    })
    //fs.createReadStream(__dirname + '/public/annotate.html', 'utf8').pipe(res);
});

/*var app = http.createServer(function(req, res){
    console.log('request for ' + req.url);
    if (req.url === '/' || req.url === '/login'){
        res.writeHead(200, {'Content-Type' : 'text/html'});
        fs.createReadStream(__dirname + '/annotate.html', 'utf8').pipe(res);
    }
    else if (req.url === '/annotation'){
        res.writeHead(200, {'Content-Type' : 'text/html'});
        var myStream = fs.createReadStream(__dirname + '/annotate.html', 'utf8');
        myStream.pipe(res);
    }
    else{
        res.writeHead(404, {'Content-Type' : 'text/html'});
        var myStream = fs.createReadStream(__dirname + '/404.html', 'utf8');
        myStream.pipe(res);   
    }
});
*/
//######################## Socket ########################

io.sockets.on("connection", function(socket){
    console.log('[*] Client connected');
    console.log(socket.handshake.time);
    console.log(socket.handshake.address);
    
    socket.on('nouvelleAnnotation', function(annotation){
        
       valeur = JSON.parse(annotation);
       var val_id = valeur.id;
       var val_sexist = valeur.sexist;
       console.log(val_id, val_sexist);
       console.log(corpus[val_id + 1]);
       socket.emit('entree', JSON.stringify({ id: val_id + 1, txt: corpus[val_id + 1][1] }));
    });
    
});

//######################## Fonctions ########################

function getCorpus(){
    fs.createReadStream(csvFile).pipe(parse({delimiter: ';'})).on('data', function(csvrow) {        
            corpus.push(csvrow);        
        })
        .on('end',function() {
            console.log('[OK] Corpus loaded');
    });
}


//######################## Run ########################
server.listen(listen_port, serverUrl);
console.log('[*] App running at http://' + serverUrl + ':'+ listen_port+'/');
