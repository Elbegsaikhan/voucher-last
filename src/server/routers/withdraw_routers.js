import auth from "../../auth.js";
import Withdraw from "../models/Withdraw";
import winston from "winston";
import async from "async";
import { check, validationResult } from "express-validator/check";
import { matchedData } from "express-validator/filter";
// import Product from '../models'
import User from "../models/User";
import Product from "../models/Product";
import Request from "../models/Request";
// import Request from "../models/Request";

module.exports = function (router) {
    router.get("/withdraw/:current", function (req, res) {
        let start = parseInt(req.params.current);
        console.log("Company", req.user._id);
        console.log("Start", start);
        if (isNaN(start)) {
            start = 0;
        }
        Product.find({ status: "active", companyId: req.user._id }).exec(function (err, products) {
            if (err) {
                winston.error(err);
                return res.status(200).json({ success: false, message: "Системд алдаа гарлаа" });
            } else {

                // let arrs = [];
                // products.map((r, idnex) => {
                //     // arrs.push(JSON.stringify(r._id));
                //     arrs.push(r._id)
                // });
                // console.log(arrs[0]);
                // console.log(typeof arrs[0]);

                async.parallel(
                    [
                        function (callback) {
                            Withdraw.find({
                                status: { $ne: "delete" },
                                product: { $in: (products || []).map(aa => aa._id) },
                            }).populate(["user", "product"])
                                .exec(function (err, result) {
                                    callback(err, result);
                                });
                        },
                        function (callback) {
                            Withdraw.count({
                                status: { $ne: "delete" },
                                product: { $in: (products || []).map(aa => aa._id) }
                            }).exec(function (err, result) {
                                callback(err, result);
                            });
                        },
                        function (callback) {
                            User.find({ status: "active", _id: req.user._id }).exec(function (err, result) {
                                callback(err, result);
                            });
                        },
                        //
                    ],
                    function (err, results) {
                        // console.log("Result", results);
                        if (err) {
                            winston.error(err);
                            return res.status(200).json({ success: false, message: "Системд алдаа гарлаа" });
                        } else {
                            return res.json({ success: true, items: results[0] || [], all: results[1], user: results[2] });
                        }
                    }
                );
            }
        });
    });
    router.get("/withdrawUser/:current", function (req, res) {
        let start = parseInt(req.params.current);
        console.log("Company", req.user._id);
        console.log("Start", start);
        if (isNaN(start)) {
            start = 0;
        }
        async.parallel([
            function (callback) {
                Withdraw.find({ status: { $ne: "delete" }, user: req.user._id }).exec(function (err, result) {
                    callback(err, result)
                })
            },
            function (callback) {
                Withdraw.count({ status: { $ne: "delete" }, user: req.user._id }, function (err, result) {
                    callback(err, result)
                })
            }
        ], function (err, results) {
            if (err) {
                winston.error(err)
                return res.status(200).json({ success: false, message: 'Withdraw router dr aldaa' })
            } else {
                return res.json({ success: true, item: results[0] || [], all: results[1] })
            }
        })

    });
    router.get('/withdrawChangeStats', auth.company, function (req, res) {
        Withdraw.findOne({ _id: req.query.id }).exec(function (err, rqq) {
            if (err) {
                winston.error(err);
                return res.status(200).json({ success: false, message: 'Системд алдаа гарлаа1' });
            } else if (rqq && (req.query.value === 'pending' || req.query.value === 'active')) {
                rqq.status = req.query.value;
                rqq.save(function (err, ssss) {
                    // console.log("SSS", ssss)
                    if (err) {
                        winston.error(err);
                        return res.json({ success: false, message: 'Системд алдаа гарлаа2' });
                    } else {
                        Withdraw.findOne({ _id: ssss._id }).deepPopulate(['user', 'product']).exec(function (err, prodyc) {
                            if (err) {
                                winston.error(err);
                                return res.status(200).json({ success: false, message: 'Системд алдаа гарлаа3' });
                            } else if (prodyc) {
                                return res.json({ success: true, item: prodyc });
                            } else {
                                return res.status(200).json({ success: false, message: 'Системд алдаа гарлаа4' });
                            }
                        })
                    }
                });
            } else if (rqq && (req.query.value === 'hvrgej' || req.query.value === 'hvrgsen' || req.query.value === 'hvleegdej')) {
                rqq.delivery = req.query.value;
                rqq.save(function (err, ssss) {
                    // console.log("SSS", ssss)
                    if (err) {
                        winston.error(err);
                        return res.json({ success: false, message: 'Системд алдаа гарлаа2' });
                    } else {
                        Withdraw.findOne({ _id: ssss._id }).deepPopulate(['user', 'product']).exec(function (err, prodyc) {
                            if (err) {
                                winston.error(err);
                                return res.status(200).json({ success: false, message: 'Системд алдаа гарлаа3' });
                            } else if (prodyc) {
                                return res.json({ success: true, item: prodyc });
                            } else {
                                return res.status(200).json({ success: false, message: 'Системд алдаа гарлаа4' });
                            }
                        })
                    }
                });
            } else {
                return res.status(200).json({ success: false, message: 'Системд алдаа гарлаа5' });
            }
        })
    });
    // router.get('/withdraw/:current', auth.company, function (req, res) {
    //     let start = parseInt(req.params.current)
    //     if (isNaN(start)) {
    //         start = 0
    //     }
    //     console.log("REq", req.params.current)
    //     async.parallel([
    //         function (callback) {
    //             Withdraw.find({status: {$ne: 'delete'}}).exec(function (err, result) {
    //                 callback(err, result)
    //             })
    //         },
    //         function (callback) {
    //             Withdraw.count({status: {$ne: 'delete'}}, function (err, result) {
    //                 callback(err, result)
    //             })
    //         }
    //     ], function (err, results) {
    //         if (err) {
    //             winston.error(err)
    //             return res.status(200).json({success: false, message: 'Withdraw dr aldaa'})
    //         } else {
    //             return res.json({success: true, result: results[0] || [], all: results[1]})
    //         }
    //     })
    // })
    // router.post("save/withdraw", [
    //     check('_id')
    //         .trim(),
    //     check('amount')
    //         .trim()
    // ], function(req, res) {
    //     const errors = validationResult(req)
    //     if(!errors.isEmpty()){
    //         return res.status(200).json({ success: false, message: `Aldaa ${errors.array()[0].msg}`})
    //     }
    //     let data = matchedData(req)
    //     console.log("Withdraw", data)
    //     if(req.body._id === 0){
    //         let withdraw = new Withdraw();
    //         withdraw.amount = data.amount;
    //         withdraw.sku = data.sku;
    //         withdraw.save(function(err,data){
    //             if(err){
    //                 winston.error(err)
    //                 return res.json({ success: false, message: 'Системд алдаа гарлаа'})
    //             }
    //             if(data){
    //                 return res.json({success: true, sucmod: true, message: 'Амжилттай хадгалагдлаа'})
    //             }else {
    //                 return res.json({ success: false, message: 'Systemd aldaa garlaaa'})
    //             }
    //
    //         })
    //     }else {
    //         return res.json({ success: true, message: 'ene data bgaa'})
    //     }
    // })
    router.post(
        "/save/withdraw",
        [
            check("id").trim(),
            check("amount").trim(),
            check("companyID").trim(),
            check("userID").trim(),
            check("productID").trim(),
            check("sku").trim(),
            check("info").trim()
        ],
        function (req, res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(200).json({
                    success: false,
                    message: `Aldaa ${errors.array()[0].msg}`,
                });
            }
            let data = matchedData(req);
            console.log("Data nfo ", data);

            if (req.body.id === 0) {
                let withdraw = new Withdraw();
                withdraw.amount = data.amount;
                withdraw.user = data.userID;
                withdraw.product = data.productID;
                withdraw.companyID = data.companyID;
                withdraw.sku = data.sku;
                withdraw.info = data.info
                // withdraw.productId = data.productId;
                withdraw.save(function (err, data) {
                    if (err) {
                        winston.error(err);
                        return res.json({
                            success: false,
                            message: "Системд алдаа гарлаа",
                        });
                    }
                    if (data) {
                        return res.json({
                            success: true,
                            sucmod: true,
                            message: "Амжилттай хадгалагдлаа",
                            result: data,
                            edit: false,
                        });
                    } else {
                        return res.json({
                            success: false,
                            message: "Системд алдаа гарлаа",
                        });
                    }
                });
            } else {
                Withdraw.findOne({ _id: req.body._id, status: "active" }).exec(function (err, withdraw) {
                    if (err) {
                        winston.error(err);
                        return res.status(200).json({
                            success: false,
                            message: "Системд алдаа гарлаа",
                        });
                    }
                    console.log("Server js product ", withdraw);
                    console.log("Server js product err", err);
                    if (withdraw) {
                        withdraw.amount = data.amount;
                        withdraw.user = data.userID;
                        withdraw.product = data.productID;
                        withdraw.companyID = data.companyID;
                        withdraw.sku = data.sku;
                        withdraw.save(function (err, data) {
                            if (err) {
                                winston.error(err);
                                return res.json({
                                    success: false,
                                    message: "Системд алдаа гарлаа",
                                });
                            }
                            if (data) {
                                return res.json({
                                    success: true,
                                    sucmod: true,
                                    message: "Худалдан авалт амжилттай",
                                    result: data,
                                    edit: true,
                                });
                            } else {
                                return res.json({
                                    success: false,
                                    message: "Системд алдаа гарлаа",
                                });
                            }
                        });
                    } else {
                        return res.json({
                            success: false,
                            message: "Withdraw олдсонгүй",
                        });
                    }
                });
            }
        }
    );
};
