var mongoose = require("mongoose");
var Mekan = mongoose.model("mekan");

const cevapOlustur = function(res,status,content){
    res.status(status).json(content);
}
var sonPuanHesapla=function(gelenMekan){
    var i,yorumSayisi,ortalamaPuan,toplamPuan;
    if(gelenMekan.yorumlar && gelenMekan.yorumlar.length>0){
        yorumSayisi=gelenMekan.yorumlar.length;
        toplamPuan=0;
        for(i=0;i<yorumSayisi;i++){
            toplamPuan=toplamPuan+gelenMekan.yorumlar[i].puan;
        }
        ortalamaPuan=parseInt(toplamPuan/yorumSayisi,10); 
        gelenMekan.puan=ortalamaPuan;
        gelenMekan.save(function(hata){ 
            if(hata){
                console.log(hata);
            }
        });
    }
}

var ortalamaPuanGuncelle=function(mekanid){
    Mekan.findById(mekanid).select("puan yorumlar").exec(function(hata,mekan){
        if(!hata){
            sonPuanHesapla(mekan);
        }
    }); 
}
var yorumOlustur=function(req,res,gelenMekan){
    if(!gelenMekan){
        cevapOlustur(res,404,{"mesaj":"mekanid bulunamad─▒",});
    }
    else{
        gelenMekan.yorumlar.push({ 
            yorumYapan:req.body.yorumYapan,
            puan:req.body.puan,
            yorumMetni:req.body.yorumMetni,
            tarih:Date.now()
        });
        gelenMekan.save(function(hata,mekan){
            var yorum;
            if(hata){
                cevapOlustur(res,404,hata);
            }else{
                ortalamaPuanGuncelle(mekan._id);
                yorum=mekan.yorumlar[mekan.yorumlar.length-1];
                cevapOlustur(res,201,yorum); 
            }
        });
    }
}

const yorumEkle =(req,res) => {
   const mekanid=req.params.mekanid;
   if(mekanid){
    Mekan
        .findById(mekanid)
        .select("yorumlar")
        .exec((hata,gelenMekan) => {
            if(hata){
                res.status(400).json(hata);
            }else{
                yorumOlustur(req,res,gelenMekan);
            }
        });
   }else{
    res.status(404).json({mekan: "Mekan bulunamad─▒."});
   }

};
const yorumSil = function(req,res){
    if(!req.params.mekanid || !req.params.yorumid) {
        cevapOlustur(res,404,{"mesaj":"Bulunamad─▒ mekanid ve yorumid gerekli"});
        return;
    }
    Mekan.findById(req.params.mekanid).select("yorumlar")
        .exec(function(hata,gelenMekan){
            if(!gelenMekan){
                cevapOlustur(res,404,{"mesaj":"mekanid bulunamad─▒"});
            return;    
            }else if(hata){
                cevapOlustur(res,400,hata);
                return;
            }
            if(gelenMekan.yorumlar && gelenMekan.yorumlar.length>0){
                if(!gelenMekan.yorumlar.id(req.params.yorumid)){
                    cevapOlustur(res,404,{"mesaj": "yorumid bulunamad─▒"});
                }else{
                    gelenMekan.yorumlar.id(req.params.yorumid).remove();
                    gelenMekan.save(function(hata,mekan){
                        if(hata){
                            cevapOlustur(res,404,hata);
                        }else{
                            ortalamaPuanGuncelle(mekan._id);
                            cevapOlustur(res,200,{"durum":"yorum silindi"});}});
                }}else {
                    cevapOlustur(res,404,{"mesaj":"Silinecek yorum bulunamad─▒",});
                }
})
}

const yorumGuncelle = function(req,res){
   if(!req.params.mekanid || !req.params.yorumid){
    cevapOlustur(res,404,{"mesaj":"Bulunamd─▒. mekanid ve yorumid zorunlu."});
    return;
}
Mekan.findById(req.params.mekanid).select("yorumlar")
    .exec(function(hata,gelenMekan){
        var yorum;
        if(!gelenMekan){cevapOlustur(res,404,{"mesaj":"mekanid bulunamad─▒"});
        return;} else if(hata){cevapOlustur(res,400,hata);
        return;}
        if(gelenMekan.yorumlar && gelenMekan.yorumlar.length>0){
            yorum=gelenMekan.yorumlar.id(req.params.yorumid);
            if(!yorum) {cevapOlustur(res,404,{"mesaj":"yorumid bulunamad─▒."});
        }else{
            yorum.yorumYapan=req.body.yorumYapan;
            yorum.puan=req.body.puan;
            yorum.yorumMetni=req.body.yorumMetni;
            gelenMekan.save(function(hata,mekan){
                if(hata){
                    cevapOlustur(res,404,hata);}else{
                            ortalamaPuanGuncelle(mekan._id);
                            cevapOlustur(res,200,yorum);}});}
            }else{
                cevapOlustur(res,404,{"mesaj":"G├╝ncellenecek yorum yok",
            });
            }
    });
};
const yorumGetir = function(req,res){
   if(req.params && req.params.mekanid && req.params.yorumid) {
    Mekan.findById(req.params.mekanid)
    .select("ad yorumlar")
    .exec(function(hata,mekan){
        var cevap,yorum;
        if(!mekan){
            cevapOlustur(res,404,{
                "hata":"B├Âyle bir mesaj yok"
            });
            return;
        }else if (hata) {
            cevapOlustur(res,400,hata);
            return;
        }
        if(mekan.yorumlar && mekan.yorumlar.length > 0){
            yorum = mekan.yorumlar.id(req.params.yorumid);
            if(!yorum){
                cevapOlustur(res,404,{
                    "hata":"B├Âyle bir yorum yok!",
                });
            }
            else {
                cevap = {
                    mekan: {
                        ad:mekan.ad,
                        id:req.params.mekanid,
                    },
                    yorum: yorum,
                };
                cevapOlustur(res,200,cevap);
            }
        } else {
            cevapOlustur(res,404,{"hata":"Hi├ž yorum yok",
            });
        }
    });
   }else {
    cevapOlustur(res,404,{
        "hata":"Bulunamad─▒. mekanid ve yorumid mutlaka girilmeli",
    });
   }
}
module.exports={
    yorumEkle,
    yorumSil,
    yorumGuncelle,
    yorumGetir
}

