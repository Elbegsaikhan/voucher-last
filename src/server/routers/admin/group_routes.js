import auth from "../../../auth";
import Group from "../../models/Group";
import GroupName from "../../models/GroupName";
import Tution from "../../models/Tution";
import winston from 'winston';
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";

module.exports = function (router) {

    router.get('/groups', auth.company ,function (req,res) {
        Group.find({status: 'active', company: req.user._id}).deepPopulate('title').exec(function(err , categories){
            if(err){
                winston.error("/categories" , err);
                return res.status(200).json({success: false,message: 'Системд алдаа гарлаа'});
            } else {
                GroupName.find({status: 'active'},(err , names)=>{
                    if(err){
                        winston.error("/categories" , err);
                        return res.status(200).json({success: false,message: 'Системд алдаа гарлаа'});
                    } else {
                        return res.json({success:true,categories : categories || [],names : names || []})
                    }
                })
            }
        })
    });
    router.post('/group/action', auth.company ,[
        check('_id')
            .trim(),
        check('title')
            .not()
            .isEmpty()
            .withMessage('Гарчиг сонгоно уу')
            .trim(),
        check('order')
            .not()
            .isEmpty()
            .withMessage('Дараалал оруулна уу')
            .isNumeric()
            .withMessage('Дараалал тоо байх шаардлагатай')
            .trim(),
    ],function (req,res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({success:false,message: errors.array()[0].msg});
        }
        let data = matchedData(req);
        if(req.body._id === 0) {
            Group.count({company: req.user._id, status: 'active'}).exec(function(err,count) {
                if (err) {
                    winston.error(err);
                    return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                } else {
                    if ((req.user.membership === 'platinum' && count < 12) || (req.user.membership === 'gold' && count < 4)) {
                        let cate = new Group();
                        cate.title = data.title;
                        cate.order = data.order;
                        cate.company = req.user._id;
                        cate.save(function (err, data) {
                            if (err) {
                                winston.error(err);
                                return res.json({success: false, message: 'Системд алдаа гарлаа'});
                            }
                            if (data) {
                                Group.findOne({_id: data._id}).deepPopulate(['title']).exec(function(err,aaa) {
                                    return res.json({
                                        success: true,
                                        sucmod: true,
                                        message: 'Амжилттай хадгалагдлаа',
                                        result: aaa,
                                        edit: false
                                    });
                                });
                            } else {
                                return res.json({success: false, message: 'Системд алдаа гарлаа'});
                            }
                        });
                    } else {
                        return res.json({success: false, message: 'Оруулах боломжтой бүлгийн тоо хэтэрсэн байна.'});
                    }
                }
            })
        } else {
            Group.findOne({_id: req.body._id, status: 'active'}).exec(function(err,cate){
                if(err) {
                    winston.error(err);
                    return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                }
                if(cate) {
                    cate.title = data.title;
                    cate.order = data.order;
                    cate.company = req.user._id;
                    cate.save(function (err, data) {
                        if(err) {
                            winston.error(err);
                            return res.json({success: false, message: 'Системд алдаа гарлаа'});
                        }
                        if(data) {
                            Group.findOne({_id: data._id}).deepPopulate(['title']).exec(function(err,aaa) {
                                return res.json({success: true, sucmod: true, message: 'Амжилттай хадгалагдлаа', result: aaa, edit: true});
                            });
                        } else {
                            return res.json({success: false, message: 'Системд алдаа гарлаа'});
                        }
                    });
                } else {
                    return res.json({success: false, message: 'Location олдсонгүй'});
                }
            });
        }
    });
    router.get('/get/group/:id', auth.company ,function (req,res) {
        Group.findOne({_id: req.params.id, status: 'active', company: req.user._id}).exec(function(err,result){
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
    router.get('/delete/group/:id', auth.company ,function (req,res) {
        Tution.find({group: req.params.id, status: 'active'}).exec((err,user)=>{
            if(err) {
                winston.error("/delete/category/:id",err);
                return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
            } else {
                if(user.length == 0){
                    Group.findOne({_id: req.params.id, status: 'active', company: req.user._id}).exec(function(err,cate){
                        if(err) {
                            winston.error(err);
                            return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                        }
                        if(cate) {
                            cate.status = 'delete';
                            cate.save(function (err, data) {
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
                            return res.json({success: false, message: 'Location олдсонгүй'});
                        }
                    });
                } else {
                    return res.json({success: false, message: 'Байгууллага харьяалагдсан байршил байна!'});
                }
            }
        })
    });
};
