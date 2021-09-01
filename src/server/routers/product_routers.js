import Product from "../models/Product.js";
import winston from "winston";
import async from "async";

module.exports = (router) => {
    router.get("/product", function (req, res) {

        async.parallel([
            function(callback){
                Product.find({ status: "active"}).populate("category").exec(function (err, result) {
                    callback(err, result);
                })

            },
            function (callback){
                Product.count({status:'active'}, function (err, result){
                    callback(err, result)
                })
            }
        ], function(err, results) {
            if(err){
                winston.error(err)
                return res.status(200).json({success: false, message: 'Product router dr aldaa'})
            }else {
                return res.json({ success: true, result: results[0] || [], all: results[1]})
            }
        })
    });
    router.get("/search/:title", function(req, res) {
        // console.log("Title", req.params.title)
        let a = RegExp(req.params.id)
        console.log("A", a)
        async.parallel([
            function(callback){
                Product.find({ status: "active", title: a}).populate("category").exec(function (err, result) {
                    callback(err, result);
                })
            },
            function (callback){
                Product.count({status:'active', title: a}, function (err, result){
                    callback(err, result)
                })
            }
        ], function(err, results) {
            if(err){
                winston.error(err)
                return res.status(200).json({success: false, message: 'Product search dr aldaa'})
            }else {
                return res.json({ success: true, result: results[0] || [], all: results[1]})
            }
        })
    })
};
