var mongoose = require( 'mongoose' );
//var dbURI = 'mongodb://localhost/mekanbul'; 
var dbURI="mongodb+srv://mekan32:mekan32@mekanbul.jiygsvz.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(dbURI);
mongoose.connection.on("connected",function(){
    console.log(dbURI + " adresindeki veritabanına bağlanıldı\n");
});
mongoose.connection.on("error",function(){
    console.log("Bağlantı hatası\n");
});
mongoose.connection.on("disconnected",function(){
    console.log("Bağlantı kesildi!\n");
});

function kapat(msg, callback) {
    mongoose.connection.close(function(){
        console.log(msg);
        callback();
    });
}

process.on("SIGINT", function() {
    kapat("Uygulama kapatıldı!",function(){
        process.exit(0);
    });
});

require("./mekansema"); 
