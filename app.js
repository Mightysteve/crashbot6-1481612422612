/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

//=========================================================
// Bot
//=========================================================

var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
// starting comment var connector = new builder.ChatConnector({
// appId: process.env.MICROSOFT_APP_ID,
// appPassword: process.env.MICROSOFT_APP_PASSWORD
// ending comment});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, "Hello... What's your super balance?");
    },

    function(session, results) {
        session.userData.name = results.response;
        var name1 = session.userData.name;
        builder.Prompts.number(session, "How much do you withdraw each month?");
    },

    function(session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "What crash do you want to simulate?", ["1987", "GFC", "No crash"]);
    },


    function(session, results) {
        session.userData.language = results.response.entity;

        var withdrawal = session.userData.coding;
        var year = session.userData.language;
        var balance = session.userData.name;
        var balance2 = balance;
        var lasts1;
        var i;
        var h;
        var j;
        var gfcint;
        var crashint;
        var accume1 = 33333;
        var g;

        if (year == "87 Crash") {

            for (i = 0; i < 9; i++) {

                if (i == 0) {
                    gfcint = -1 * .2322;
                }

                if (i == 1) {
                    gfcint = -1 * .1862;
                }

                if (i == 2) {
                    gfcint = .2745;
                }

                if (i == 3) {
                    gfcint = -1 * .0893;
                }

                if (i == 4) {
                    gfcint = .231;
                }

                if (i == 5) {
                    gfcint = .0845;
                }

                if (i == 6) {
                    gfcint = .086;
                }

                if (i == 7) {
                    gfcint = .081;
                }
                if (i == 7) {
                    gfcint = .2461;
                }

                balance = ((balance - withdrawal) * (1 + gfcint));
                lasts1 = balance.toFixed(2);

                if (balance < 0) {
                    lasts1 = "Capital exhausted in " + i + " years";
                    i = 8;
                }

            }
        } else if (year == "GFC") {

            for (h = 0; h < 9; h++) {

                if (h == 0) {
                    crashint = -1 * .1019;
                }

                if (h == 1) {
                    crashint = -1 * .337;
                }

                if (h == 2) {
                    crashint = .1925;
                }

                if (h == 3) {
                    crashint = .24;
                }

                if (h == 4) {
                    crashint = -1 * .014;
                }

                if (h == 5) {
                    crashint = .2196;
                }

                if (h == 6) {
                    crashint = .106;
                }

                if (h == 7) {
                    crashint = .0784;
                }

                if (h == 8) {
                    crashint = -.006;
                }

                balance = ((balance - withdrawal) * (1 + crashint));
                lasts1 = balance.toFixed(2);

                if (balance < 0) {
                    lasts1 = "Capital exhausted in " + h + " years";
                    h = 8;
                }

            }
        } else {
            year == "No crash";

            for (j = 0; j < 9; j++) {
                balance = ((balance - withdrawal) * (1.05));

                lasts1 = balance.toFixed(2);

                if (balance < 0) {
                    lasts1 = "Capital exhausted in " + j + " years";
                    j = 8;
                }

            }
        }

        balance = balance.toFixed(2);

        console.log("accume1 " + accume1);
        console.log("withdrawal " + withdrawal);
        console.log("year " + year);
        console.log("balance " + balance);

        if (year == "No crash") {
            session.send("Got it...  You want to see your superannuation balance if there was no crash. Your current  balance is $" + balance2 + " and you will withdraw $" + withdrawal + " every year. Assuming your fund earns 5% pa net of fees, inflation and taxes, your super balance will be $" + lasts1 + " in 8 years.");
        } else if (year === "GFC") {
            session.send("Got it...  You want to see how your balance would be affected by a market crash. You chose to simulate the " + year + " crash. Your current super balance is $" + balance2 + " and you will withdraw $" + withdrawal + " every year. Your super balance would be $" + lasts1 + " in 8 years time if returns match the Dow from May 2008.");
        } else {
            session.send("Got it...  You want to see how your balance would be affected by a market crash. You chose to simulate the " + year + " crash. Your current super balance is $" + balance2 + " and you will withdraw $" + withdrawal + " every year. Your super balance would be $" + lasts1 + " in 8 years time if returns match the Dow from May 1987.");
        }
    }
]);

