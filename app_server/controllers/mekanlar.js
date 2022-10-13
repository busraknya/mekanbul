var express = require('express');
var router = express.Router();

const anaSayfa = function (req, res, next) {
  res.render('anasayfa', { title: 'Ana sayfa' });
}

const mekanBilgisi = function (req, res) {
  res.render('mekanbilgisi', { "title": "Mekan bilgisi" });
}

const yorumEkle = function (req, res) {
  res.render('yorumekle', { "title": "Yorum ekle" });
}


module.exports = {
  anaSayfa,
  mekanBilgisi,
  yorumEkle
}