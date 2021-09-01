import Product from "../../models/Product.js";
import auth from "../../../auth";
import async from 'async';
import winston from "winston";
import path from 'path'
import Jimp from 'jimp'
import fs from 'fs'
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";
import moment from 'moment'

module.exports = function (router) {
    router.get('/product/:current', auth.company, function (req, res) {
        let start = parseInt(req.params.current);
        if (isNaN(start)) {
            start = 0;
        }
        async.parallel([
            function (callback) {
                Product.find({status: "active"}).populate("category").exec(function (err, result) {
                    callback(err, result);
                })
            },
            function (callback) {
                Product.count({status: 'active'}, function (err, result) {
                    callback(err, result)
                })
            }
        ], function (err, results) {
            if (err) {
                winston.error(err)
                return res.status(200).json({success: false, message: 'Product router dr aldaa'})
            } else {
                return res.json({success: true, result: results[0] || [], all: results[1]})
            }
        })
    });

    router.get('/get/product/:id', auth.company, function (req, res) {
        Product.findOne({_id: req.params.id, status: 'active'}).exec(function (err, result) {
            if (err) {
                winston.error(err)
                return res.status(200).json({success: false, message: 'Системд жоохон алдаа гарлаа'})
            }
            if (result) {
                return res.json({success: true, result: result})
            } else {
                return res.json({success: false, message: 'Олдсонгүй'})
            }
        })
    });
    // Post
    router.post('/save/product', auth.company, [
        check('_id')
            .trim(),
        check('title')
            .trim(),
        check('image')
            .trim(),
        check('desc')
            .trim(),
        check('price')
            .isNumeric(),
        check('date')
            .trim(),
        check('address')
            .trim(),
        check('category')
            .trim(),
        check('companyId')
            .trim(),
        check('companyName')
            .trim(),
        check('torol')
            .trim(),
        check('phone').trim(),
    ], function (req, res) {
        console.log("req", req)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({success: false, message: `Aldaa ${errors.array()[0].msg}`});
        }
        let data = matchedData(req);
        console.log("Data ", data)

        // console.log("Res", res)
        function imageFc(callback) {
            if (req.body.newImage) {
                let input = path.resolve(__dirname, "../../../../static" + data.image);
                let out = path.resolve(__dirname, "../../../../static/uploads/" + moment().format('YYYY') + '/' + moment().format('MM'));
                fs.mkdir(out, function (e) {
                    Jimp.read(input, function (err, image) {
                        if (err) {
                            winston.error('jump read error', err);
                            res.json({success: false, msg: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                        if (image) {
                            image.quality(70);
                            let image_url = path.resolve(__dirname, "../../../../static/uploads/" + moment().format('YYYY') + '/' + moment().format('MM') + '/' + data.image.replace('/tmp/', ''));
                            image.write(image_url, function (err) {
                                if (err) {
                                    winston.error('upload write error', err);
                                    res.json({success: false, msg: "Зураг хадгалж чадсангүй"});
                                } else {
                                    callback(`/uploads/${moment().format('YYYY')}/${moment().format('MM')}/${data.image.replace('/tmp/', '')}`);
                                }
                            });
                        } else {
                            res.json({success: false, message: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                    });
                });
            } else {
                callback(data.image);
            }
        }

        if (req.body._id === 0) {
            console.log('Data price', data)
            imageFc(function (imagePath) {
                let product = new Product();
                product.title = data.title;
                product.desc = data.desc;
                product.price = data.price;
                product.address = data.address;
                product.date = data.date;
                product.torol = data.torol;
                product.category = data.category;
                product.companyId = data.companyId;
                product.companyName = data.companyName;
                product.phone = data.phone;
                product.image = imagePath;
                product.save(function (err, data) {
                    if (err) {
                        winston.error(err);
                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                    }
                    if (data) {
                        return res.json({success: true, sucmod: true, message: 'Амжилттай хадгалагдлаа', result: data, edit: false});
                    } else {
                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                    }
                });
            })
        } else {
            imageFc(function (imagePath) {
                Product.findOne({_id: req.body._id, status: 'active'}).exec(function (err, product) {
                    if (err) {
                        winston.error(err);
                        return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                    }
                    if (product) {
                        console.log("Zasvar ", product)
                        product.title = data.title;
                        product.desc = data.desc;
                        product.price = data.price;
                        product.address = data.address;
                        product.date = data.date;
                        product.torol = data.torol;
                        product.category = data.category;
                        // product.companyId = data.companyId;
                        // product.companyName = data.companyName;
                        product.phone = data.phone;
                        product.image = imagePath;
                        product.save(function (err, data) {
                            if (err) {
                                winston.error(err);
                                return res.json({success: false, message: 'Системд алдаа гарлаа'});
                            }
                            if (data) {
                                return res.json({success: true, sucmod: true, message: 'Амжилттай хадгалагдлаа', result: data, edit: true});
                            } else {
                                return res.json({success: false, message: 'Системд алдаа гарлаа'});
                            }
                        });
                    } else {
                        return res.json({success: false, message: 'Product олдсонгүй'});
                    }
                });
            })
        }
    });
    router.get('/delete/product/:id', auth.company, function (req, res) {
        Product.findOne({_id: req.params.id, status: 'active'}).exec(function (err, product) {
            if (err) {
                winston.error(err);
                return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
            }
            if (product) {
                product.status = 'delete';
                product.save(function (err, data) {
                    if (err) {
                        winston.error(err);
                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                    }
                    if (data) {
                        return res.json({success: true, sucmod: true, message: 'Амжилттай услтгагдлаа', id: req.params.id});
                    } else {
                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                    }
                });
            } else {
                return res.json({success: false, message: 'product олдсонгүй'});
            }
        });
    });
};
