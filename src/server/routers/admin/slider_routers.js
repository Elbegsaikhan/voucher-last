import winston from 'winston';
import async from 'async';
import Slider from "../../models/Slider";
import path from 'path';
import auth from "../../../auth";
import moment from 'moment';
import Jimp from "jimp";
import fs from "fs";
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";


module.exports = function (router) {
    router.get('/sliders/:current', auth.admin ,function (req,res) {
        let start = parseInt(req.params.current);
        if (isNaN(start)) {
            start = 0;
        }
        async.parallel([
            function(callback){
                Slider.find({status: 'active'}).sort({order : 1}).skip(start * 30).limit(30).exec(function(err,result){
                    callback(err,result);
                });
            },
            function(callback){
                Slider.count({status:'active'},function(err,result){
                    callback(err,result)
                })
            }
        ],function(err,results){
            if(err) {
                winston.error(err);
                return res.status(200).json({success: false,message: 'Системд алдаа гарлаа'});
            } else {
                return res.json({success: true,result: results[0] || [], all: results[1]});
            }
        })
    });
    router.get('/get/slider/:id', auth.admin ,function (req,res) {
        Slider.findOne({_id: req.params.id, status: 'active'}).exec(function(err,result){
            if(err) {
                winston.error(err);
                return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
            }
            if(result) {
                return res.json({success: true,result: result});
            } else {
                return res.json({success: false, message: 'Олдсонгүй'});
            }
        });
    });
    router.post('/save/slider', auth.admin, [
        check('_id')
            .trim(),
        check('title')
            .trim(),
        check('order')
            .not()
            .isEmpty()
            .withMessage('Дараалал оруулна уу')
            .isNumeric()
            .withMessage('Дараалал тоо байх шаардлагатай')
            .trim(),
        check('position')
            .not()
            .isEmpty()
            .withMessage('Байрлал оруулна уу')
            .isNumeric()
            .withMessage('Байрлал тоо байх шаардлагатай')
            .trim(),
        check('description')
            .trim(),
        check('image')
            .trim(),
    ] ,function (req,res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({success:false,message: errors.array()[0].msg});
        }
        let data = matchedData(req);
        console.log("Slider data", data)
        function imageFc(callback) {
            if(req.body.newImage) {
                let input = path.resolve(__dirname,"../../../../static"+data.image);
                let out = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM'));
                fs.mkdir(out,function(e){
                    Jimp.read(input, function (err, image) {
                        if(err){
                            winston.error('jump read error',err);
                            res.json({success: false, msg: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                        if(image){
                            image.quality(70);
                            let image_url = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM')+'/'+data.image.replace('/tmp/', ''));
                            image.write(image_url,function(err){
                                if(err){
                                    winston.error('upload write error',err);
                                    res.json({success: false, msg: "Зураг хадгалж чадсангүй"});
                                }else{
                                    callback(`/uploads/${moment().format('YYYY')}/${moment().format('MM')}/${data.image.replace('/tmp/', '')}`);
                                }
                            });
                        }else{
                            res.json({success: false, message: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                    });
                });
            } else {
                callback(data.image);
            }
        }
        if(req.body._id === 0) {
            imageFc(function (imagePath) {
                let slider = new Slider();
                slider.title = data.title;
                slider.description = data.description;
                slider.order = data.order;
                slider.position = data.position;
                slider.link = data.link;
                slider.image = imagePath;
                slider.save(function (err, data) {
                    if(err){
                        winston.error(err);
                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                    }
                    if(data){
                        return res.json({success: true, sucmod: true, message: 'Амжилттай хадгалагдлаа', result: data, edit: false});
                    }else{
                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                    }
                });
            })
        } else {
            imageFc(function (imagePath) {
                Slider.findOne({_id: req.body._id, status: 'active'}).exec(function(err,slider){
                    if(err) {
                        winston.error(err);
                        return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                    }
                    if(slider) {
                        slider.title = data.title;
                        slider.description = data.description;
                        slider.order = data.order;
                        slider.position = data.position;
                        slider.link = data.link;
                        slider.image = imagePath;
                        slider.save(function (err, data) {
                            if(err) {
                                winston.error(err);
                                return res.json({success: false, message: 'Системд алдаа гарлаа'});
                            }
                            if(data) {
                                return res.json({success: true, sucmod: true, message: 'Амжилттай хадгалагдлаа', result: data, edit: true});
                            } else {
                                return res.json({success: false, message: 'Системд алдаа гарлаа'});
                            }
                        });
                    } else {
                        return res.json({success: false, message: 'Slider олдсонгүй'});
                    }
                });
            })
        }
    });
    router.get('/delete/slider/:id', auth.admin ,function (req,res) {
        Slider.findOne({_id: req.params.id, status: 'active'}).exec(function(err,slider){
            if(err) {
                winston.error(err);
                return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
            }
            if(slider) {
                slider.status = 'delete';
                slider.save(function (err, data) {
                    if(err) {
                        winston.error(err);
                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                    }
                    if(data) {
                        return res.json({success: true, sucmod: true, message: 'Амжилттай услтгагдлаа', id: req.params.id});
                    } else {
                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                    }
                });
            } else {
                return res.json({success: false, message: 'Slider олдсонгүй'});
            }
        });
    });
};
