import auth from "../../../auth";

import Tution from "../../models/Tution";
import Group from "../../models/Group";
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

    router.get('/tutions/:current', auth.company ,function (req,res) {
        let start = parseInt(req.params.current);
        if (isNaN(start)) {
            start = 0;
        }
        async.parallel([
            function(callback){
                Tution.find({status: 'active', company: req.user._id}).sort({order: 1}).skip(start * 30).limit(30).exec(function(err,result){
                    callback(err,result);
                });
            },
            function(callback){
                Tution.count({status:'active', company: req.user._id},function(err,result){
                    callback(err,result)
                })
            },
            function(callback){
                Group.find({status:'active', company: req.user._id}).deepPopulate(['title']).exec(function(err,result){
                    callback(err,result)
                })
            }
        ],function(err,results){
            if(err) {
                winston.error(err);
                return res.status(200).json({success: false,message: 'Системд алдаа гарлаа'});
            } else {
                return res.json({success: true,items: results[0] || [], all: results[1], groups: results[2]});
            }
        })
    });
    router.post('/tution/action', auth.company ,[
        check('_id')
            .trim(),
        check('title')
            .not()
            .isEmpty()
            .withMessage('Гарчиг оруулна уу')
            .trim(),
        check('description')
            .not()
            .isEmpty()
            .withMessage('Тайлбйр оруулна уу')
            .trim(),
        check('group')
            .not()
            .isEmpty()
            .withMessage('Бүлэг оруулна уу')
            .trim(),
        check('price')
            .not()
            .isEmpty()
            .withMessage('Үнэ оруулна уу')
            .trim(),
        check('sale'),
        check('saleDate'),
        check('color'),
        check('images'),
        check('order'),

    ],function (req,res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({success:false,message: errors.array()[0].msg});
        }
        let data = matchedData(req);
        if(req.body._id === 0) {
            let news = new Tution();
            news.title = data.title;
            news.company = req.user._id;
            news.description = data.description;
            news.price = data.price;
            news.sale = data.sale;
            news.saleDate = data.saleDate;
            news.images = data.images;
            news.group = data.group;
            news.color = data.color;
            news.order = data.order || 0;
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
        } else {
            Tution.findOne({_id: req.body._id,company: req.user._id}).exec(function(err,news){
                if(err) {
                    winston.error(err);
                    return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                }
                if(news) {
                    news.title = data.title;
                    news.company = req.user._id;
                    news.description = data.description;
                    news.price = data.price;
                    news.group = data.group;
                    news.sale = data.sale || 0;
                    news.saleDate = data.saleDate || new Date();
                    news.images = data.images.filter(function (it) {
                        return it !== '' && it != null
                    });
                    news.order = data.order || 0;
                    news.color = data.color;
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
                } else {
                    return res.json({success: false, message: 'Сураглт олдсонгүй'});
                }
            });
        }
    });
    router.get('/delete/tution/:id', auth.company ,function (req,res) {
        Tution.findOne({_id: req.params.id,company: req.user._id}).exec(function(err,news){
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
                return res.json({success: false, message: 'Сураглт олдсонгүй'});
            }
        });
    });
    router.get('/get/tution/:id', auth.company ,function (req,res) {
        Tution.findOne({_id: req.params.id, status: 'active',company: req.user._id}).exec(function(err,result){
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