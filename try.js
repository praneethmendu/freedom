'use strict';

const request = require('request');
const cloudscraper = require('cloudscraper');
//const TeleBot = require('telebot');
//const bot = new TeleBot(teltok);




let prices = {
  USD: {
    BNS: 0,
    KOI: 0,
    USD: 1
  },
  XRP: {
    BNS: 0,
    KOI: 0
  },
  NCASH: {
    BNS: 0,
    KOI: 0
  },
  TRX: {
    BNS: 0,
    KOI: 0
  },
  REQ: {
    BNS: 0,
    KOI: 0
  },
  ETH: {
    BNS: 0,
    KOI: 0
  },
  BTC: {
    BNS: 0,
    KOI: 0
  },
  XLM: {
    BNS: 0,
    KOI: 0
  },
  NEO: {
    BNS: 0,
    KOI: 0
  },
  EOS: {
    BNS: 0,
    KOI: 0
  },
};

// rate = copy = Object.assign({}, prices);
let rate = {
  XRP: [{}, {}],
  ETH: [{}, {}],
  BTC: [{}, {}],
  USD: [{}, {}],
  NCASH: [{}, {}],
  TRX: [{}, {}],
  REQ: [{}, {}],
  XLM: [{}, {}],
  NEO: [{}, {}],
  EOS: [{}, {}],
};

let btc = {
  yo: 0.0001
}

// get USDT pricess
function getbin() {
  request('https://api.binance.com/api/v3/ticker/price', function(
    error,
    response,
    body
  ) {
    try {
      let jobj = JSON.parse(body)

      btc.yo = 1 / jobj.find(
        x => x.symbol == 'TUSDBTC'
      ).price;

      prices['BTC']['USD'] = btc.yo;

      prices['ETH']['USD'] = 1 / jobj.find(
        x => x.symbol == 'TUSDETH'
      ).price;
      prices['XRP']['USD'] = jobj.find(
        x => x.symbol == 'XRPBTC'
      ).price * btc.yo;

      prices['NCASH']['USD'] = (jobj.find(
        x => x.symbol == 'NCASHBTC'
      ).price) * btc.yo;
      prices['TRX']['USD'] = (jobj.find(
        x => x.symbol == 'TRXBTC'
      ).price) * btc.yo;
      prices['REQ']['USD'] = (jobj.find(
        x => x.symbol == 'REQBTC'
      ).price) * btc.yo;
      prices['XLM']['USD'] = (jobj.find(
        x => x.symbol == 'XLMBTC'
      ).price) * btc.yo;
      prices['NEO']['USD'] = (jobj.find(
        x => x.symbol == 'NEOBTC'
      ).price) * btc.yo;
      prices['EOS']['USD'] = (jobj.find(
        x => x.symbol == 'EOSBTC'
      ).price) * btc.yo;


      update('BIN');
    } catch (e) {
      console.log(e);
    }
  });
}

function getbns() {
  request('https://bitbns.com/order/getTickerWithVolume/', function(
    error,
    response,
    body
  ) {
    try {

      let jobj = JSON.parse(body)

      prices['BTC']['BNS'] = jobj['BTC'].last_traded_price
      prices['ETH']['BNS'] = jobj['ETH'].last_traded_price
      prices['XRP']['BNS'] = jobj['XRP'].last_traded_price
      prices['USD']['BNS'] = jobj['USDT'].last_traded_price
      prices['TRX']['BNS'] = jobj['TRX'].last_traded_price
      prices['XLM']['BNS'] = jobj['XLM'].last_traded_price
      prices['NEO']['BNS'] = jobj['NEO'].last_traded_price
      prices['EOS']['BNS'] = jobj['EOS'].last_traded_price

      update('BNS');
    } catch (e) {
      console.log(e);
    }
  });
}

function getkoin() {
  cloudscraper.get('https://koinex.in/api/ticker/', function(
    error,
    response,
    body
  ) {
    if (error) {
      console.log(error);
    } else {
      try {

        let jobj = JSON.parse(body)

        prices['ETH']['KOI'] = jobj.prices.inr.ETH;
        prices['XRP']['KOI'] = jobj.prices.inr.XRP;
        prices['BTC']['KOI'] = jobj.prices.inr.BTC;
        prices['NCASH']['KOI'] = jobj.prices.inr.NCASH;
        prices['TRX']['KOI'] = jobj.prices.inr.TRX;
        prices['REQ']['KOI'] = jobj.prices.inr.REQ;
        prices['USD']['KOI'] = jobj.prices.inr.TUSD;
        update('KOI');
      } catch (e) {
        console.log('json shit');
      }
    }
  });
}

let gotdata = {
  'KOI': false,
  'BNS': false,
  'BIN': false
}

function update(exc) {
  gotdata[exc] = true
  if (gotdata['KOI'] && gotdata['BIN'] && gotdata['BNS']) {

    Object.keys(prices).map(each => {
      try {
        rate[each][0] = prices[each]['KOI'] / prices[each]['USD'];
        rate[each][1] = prices[each]['BNS'] / prices[each]['USD'];

      } catch (e) {
        console.log(each + 'not ready');
      }
    });



    console.log(Object.keys(rate).reduce((fin, each) => `${fin}\n${each}\t\t${prices[each]['USD'].toPrecision(5)}\nkoi:${parseFloat(prices[each]['KOI']).toPrecision(5)}\t\t\t\t\t\t${rate[each][0].toPrecision(3)}\nbns:${parseFloat(prices[each]['BNS']).toPrecision(5)}\t\t\t\t\t\t${rate[each][1].toPrecision(3)}\n\n\n`));
  }
}

getbns()
getbin()
getkoin()

setInterval(() => {
  console.log('gdhdh')
}, 3000)
// Use this code if you don't use the http event with the LAMBDA-PROXY integration
// return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
