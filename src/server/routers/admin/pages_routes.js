import auth from "../../../auth";

import Page from "../../models/Page";
import winston from 'winston';
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";
import path from 'path';
import moment from 'moment';
import Jimp from "jimp";
import fs from "fs";
import slug from 'slug'
import async from "async";
module.exports = function (router) {

    router.get('/pages/:current', auth.admin ,function (req,res) {
        let start = parseInt(req.params.current);
        if (isNaN(start)) {
            start = 0;
        }
        async.parallel([
            function(callback){
                Page.find({status: 'active'}).skip(start * 30).limit(30).exec(function(err,result){
                    callback(err,result);
                });
            },
            function(callback){
                Page.count({status:'active'},function(err,result){
                    callback(err,result)
                })
            }
        ],function(err,results){
            if(err) {
                winston.error(err);
                return res.status(200).json({success: false,message: 'Системд алдаа гарлаа'});
            } else {
                return res.json({success: true,news: results[0] || [], all: results[1]});
            }
        })
    });
    router.post('/page/action', auth.admin ,[
        check('_id')
            .trim(),
        check('title')
            .not()
            .isEmpty()
            .withMessage('Гарчиг оруулна уу')
            .trim(),
        check('body')
            .not()
            .isEmpty()
            .withMessage('Мэдээ оруулна уу')
            .trim(),
        check('slug')
            .trim(),
        check('newImage')
            .trim(),
        check('image')
            .not()
            .isEmpty()
            .withMessage('Зураг оруулна уу')
            .trim(),
    ],function (req,res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({success:false,message: errors.array()[0].msg});
        }
        let data = matchedData(req);
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
                let sl = slug(data.slug || data.title);
                let regex = new RegExp("^"+sl, "i");
                Page.find({slug: regex}).exec((rr,nn)=>{
                    if(nn && nn.length > 0){
                        sl = `${sl}-${nn.length}`;
                    }
                    let news = new Page();
                    news.title = data.title;
                    news.body = data.body;
                    news.slug = sl;
                    news.image = imagePath;
                    news.save(function (err, ssss) {
                        if(err){
                            winston.error(err);
                            return res.json({success: false, message: 'Системд алдаа гарлаа'});
                        }
                        if(data){
                            return res.json({success: true, sucmod: true, message: 'Амжилттай хадгалагдлаа', result: ssss, edit: false});
                        }else{
                            return res.json({success: false, message: 'Системд алдаа гарлаа'});
                        }
                    });
                })
            })
        } else {
            imageFc(function (imagePath) {
                Page.findOne({_id: req.body._id}).exec(function(err,news){
                    if(err) {
                        winston.error(err);
                        return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                    }
                    if(news) {
                        news.title = data.title;
                        news.body = data.body;
                        news.image = imagePath || '';
                        if(news.slug !== data.slug && data.slug !== '' && data.slug != null) {
                            let sl = slug(data.slug);
                            let regex = new RegExp("^"+sl, "i");
                            Page.find({slug: regex}).exec((rr,nn)=>{
                                if(nn && nn.length -1 > 0){
                                    sl = `${sl}-${nn.length}`;
                                }
                                news.slug = sl;
                                news.save(function (err, ssss) {
                                    if(err) {
                                        winston.error(err);
                                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                                    }
                                    if(data) {
                                        return res.json({success: true, sucmod: true, message: 'Амжилттай хадгалагдлаа', result: ssss, edit: true});
                                    } else {
                                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                                    }
                                });
                            })
                        } else {
                            news.save(function (err, data) {
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
                        }
                    } else {
                        return res.json({success: false, message: 'News олдсонгүй'});
                    }
                });
            })
        }
    });
    router.get('/delete/page/:id', auth.admin ,function (req,res) {
        Page.findOne({_id: req.params.id}).exec(function(err,news){
            if(err) {
                winston.error(err);
                return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
            }
            if(news) {
                news.status = 'delete';
                news.save(function (err, data) {
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
                return res.json({success: false, message: 'News олдсонгүй'});
            }
        });
    });
    router.get('/get/page/:id', auth.admin ,function (req,res) {
        Page.findOne({_id: req.params.id, status: 'active'}).exec(function(err,result){
            if(err) {
                winston.error(err);
                return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
            }
            if(result) {
                return res.json({success: true,result});
            } else {
                return res.json({success: false, message: 'Олдсонгүй'});
            }
        });
    });
};