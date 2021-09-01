import winston from 'winston';
import async from 'async';
import GroupName from "../../models/GroupName";
import path from 'path';
import auth from "../../../auth";
import moment from 'moment';
import Jimp from "jimp";
import fs from "fs";
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";


module.exports = function (router) {
    router.get('/groupNames/:current', auth.admin ,function (req,res) {
        let start = parseInt(req.params.current);
        if (isNaN(start)) {
            start = 0;
        }
        async.parallel([
            function(callback){
                GroupName.find({status: 'active'}).sort({order : 1}).skip(start * 30).limit(30).exec(function(err,result){
                    callback(err,result);
                });
            },
            function(callback){
                GroupName.count({status:'active'},function(err,result){
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
    router.get('/get/groupName/:id', auth.admin ,function (req,res) {
        GroupName.findOne({_id: req.params.id, status: 'active'}).exec(function(err,result){
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
    router.post('/save/groupName', auth.admin, [
        check('_id')
            .trim(),
        check('title')
            .not()
            .isEmpty()
            .withMessage('Гарчиг оруулна уу')
            .trim(),
    ] ,function (req,res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({success:false,message: errors.array()[0].msg});
        }
        let data = matchedData(req);
        if(req.body._id === 0) {
            let slider = new GroupName();
            slider.title = data.title;
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
        } else {
            GroupName.findOne({_id: req.body._id, status: 'active'}).exec(function(err,slider){
                if(err) {
                    winston.error(err);
                    return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                }
                if(slider) {
                    slider.title = data.title;
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
                    return res.json({success: false, message: 'GroupName олдсонгүй'});
                }
            });
        }
    });
    router.get('/delete/groupName/:id', auth.admin ,function (req,res) {
        GroupName.findOne({_id: req.params.id, status: 'active'}).exec(function(err,slider){
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
                return res.json({success: false, message: 'GroupName олдсонгүй'});
            }
        });
    });
};