var Router = require("restify-router").Router;
var messageSender = require("../../message-sender");

var FactInventoryMovement = require("dl-module").etl.inventory.factInventoryMovement;
var FactInventorySummary = require("dl-module").etl.inventory.factInventorySummary;
var FactShipmentDocument = require("dl-module").etl.inventory.factShipmentDocument;
var FactPackingReceipt = require("dl-module").etl.inventory.factPackingReceipt;

var dbConnect = require("../../db");
var sqlConnect = require("../../sql-db");

const apiVersion = "1.0.0";

function getRouter() {

    var router = new Router();

    router.get("/", function (request, response, next) {

        var message = {
            body: "Test message",
            customProperties: {
                testproperty: "TestValue"
            }
        };

        messageSender.send(message)
            .then((result) => {
                response.send(200, result);
            })
            .catch((e) => {
                response.send(500, e);
            });

        Promise.all([dbConnect, sqlConnect])
            .then((result) => {
                var db = result[0];
                var sql = result[1];
                db.get().then((db) => {
                    var instance1 = new FactInventoryMovement(db, {
                        username: "unit-test"
                    }, sql);

                    instance1.run()
                        .catch((e) => {
                            done(e);
                        });
                });
            });

        Promise.all([dbConnect, sqlConnect])
            .then((result) => {
                var db = result[0];
                var sql = result[1];
                db.get().then((db) => {
                    var instance2 = new FactInventorySummary(db, {
                        username: "unit-test"
                    }, sql);

                    instance2.run()
                        .catch((e) => {
                            done(e);
                        });
                });
            });

        Promise.all([dbConnect, sqlConnect])
            .then((result) => {
                var db = result[0];
                var sql = result[1];
                db.get().then((db) => {
                    var instance3 = new FactShipmentDocument(db, {
                        username: "unit-test"
                    }, sql);

                    instance3.run()
                        .catch((e) => {
                            done(e);
                        });
                });
            });

        Promise.all([dbConnect, sqlConnect])
            .then((result) => {
                var db = result[0];
                var sql = result[1];
                db.get().then((db) => {
                    var instance4 = new FactPackingReceipt(db, {
                        username: "unit-test"
                    }, sql);

                    instance4.run()
                        .catch((e) => {
                            done(e);
                        });
                });
            });
    });

    return router;
}

module.exports = getRouter;