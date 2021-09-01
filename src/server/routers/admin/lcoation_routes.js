import auth from "../../../auth";

import Location from "../../models/Location";
import User from "../../models/User";
import winston from 'winston';
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";
import slug from 'slug'
import async from "async";
import Category from "../../models/Category";
module.exports = function (router) {

    router.get('/locations', auth.admin ,function (req,res) {
        async.parallel([
            function (callback) {
                Location.find({status: 'active'}).sort({order: 1}).lean().exec( function(err,result) {
                    callback(err, result)
                });
            },
            function (callback) {
                Location.find({ status: 'active', $or: [{parent: {$exists: false}}, {parent: null}] }).lean().exec( function(err,result) {
                    callback(err, result)
                });
            },
        ],function (err, results) {
            if(err){
                winston.error('/admin/api/getCategory', err);
                return res.status(200).json({success:false, msg: 'Системийн алдаа', err});
            }
            let parents = results[0].filter(item => item.parent == null || item.parent === '');
            let cates = parents.map(function (item) {
                if(results[0].some(aa => ((aa.parent || {})._id || '').toString() === item._id.toString())) {
                    return {
                        ...item,
                        child: results[0].filter(b => ((b.parent || {})._id || '').toString() === item._id.toString()) || []
                    }
                } else {
                    return item
                }
            });
            return res.status(200).json({success:true, categories:(cates || []), parentLocations:(results[1] || []) });
        })
    });
    router.post('/locations/action', auth.admin ,[
        check('_id')
            .trim(),
        check('parent'),
        check('title')
            .not()
            .isEmpty()
            .withMessage('Гарчиг оруулна уу')
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
            let sl = slug(data.title);
            let regex = new RegExp("^"+sl, "i");
            Location.find({slug: regex}).exec((rr,cc)=>{
                if(cc && cc.length > 0) {
                    sl = `${sl}-${cc.length}`;
                }
                let cate = new Location();
                cate.title = data.title;
                cate.slug = sl;
                if(data.parent) {
                    cate.parent = data.parent;
                } else {
                    cate.parent = null;
                }
                cate.order = data.order;
                cate.save(function (err, data) {
                    if(err){
                        winston.error(err);
                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                    }
                    if(data){
                        async.parallel([
                            function (callback) {
                                Location.find({status: 'active'}).sort({order: 1}).lean().exec( function(err,result) {
                                    callback(err, result)
                                });
                            },
                            function (callback) {
                                Location.find({ status: 'active', $or: [{parent: {$exists: false}}, {parent: null}] }).lean().exec( function(err,result) {
                                    callback(err, result)
                                });
                            },
                        ],function (err, results) {
                            if(err){
                                winston.error('/admin/api/getCategory', err);
                                return res.status(200).json({success:false, msg: 'Системийн алдаа', err});
                            }
                            let parents = results[0].filter(item => item.parent == null || item.parent === '');
                            let cates = parents.map(function (item) {
                                if(results[0].some(aa => ((aa.parent || {})._id || '').toString() === item._id.toString())) {
                                    return {
                                        ...item,
                                        child: results[0].filter(b => ((b.parent || {})._id || '').toString() === item._id.toString()) || []
                                    }
                                } else {
                                    return item
                                }
                            });
                            return res.status(200).json({success:true, categories:(cates || []), parentLocations:(results[1] || []) });
                        })
                    }else{
                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                    }
                });
            });
        } else {
            Location.findOne({_id: req.body._id, status: 'active'}).exec(function(err,cate){
                if(err) {
                    winston.error(err);
                    return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                }
                if(cate) {
                    cate.title = data.title;
                    cate.order = data.order;
                    if(data.parent) {
                        cate.parent = data.parent;
                    } else {
                        cate.parent = null;
                    }
                    cate.save(function (err, data) {
                        if(err) {
                            winston.error(err);
                            return res.json({success: false, message: 'Системд алдаа гарлаа'});
                        }
                        if(data) {
                            async.parallel([
                                function (callback) {
                                    Location.find({status: 'active'}).sort({order: 1}).lean().exec( function(err,result) {
                                        callback(err, result)
                                    });
                                },
                                function (callback) {
                                    Location.find({ status: 'active', $or: [{parent: {$exists: false}}, {parent: null}] }).lean().exec( function(err,result) {
                                        callback(err, result)
                                    });
                                },
                            ],function (err, results) {
                                if(err){
                                    winston.error('/admin/api/getCategory', err);
                                    return res.status(200).json({success:false, msg: 'Системийн алдаа', err});
                                }
                                let parents = results[0].filter(item => item.parent == null || item.parent === '');
                                let cates = parents.map(function (item) {
                                    if(results[0].some(aa => ((aa.parent || {})._id || '').toString() === item._id.toString())) {
                                        return {
                                            ...item,
                                            child: results[0].filter(b => ((b.parent || {})._id || '').toString() === item._id.toString()) || []
                                        }
                                    } else {
                                        return item
                                    }
                                });
                                return res.status(200).json({success:true, categories:(cates || []), parentLocations:(results[1] || []) });
                            })
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
    router.get('/get/location/:id', auth.admin ,function (req,res) {
        Location.findOne({_id: req.params.id, status: 'active'}).exec(function(err,result){
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
    router.get('/delete/location/:id', auth.admin ,function (req,res) {
        User.find({location: req.params.id, status: 'active'}).exec((err,user)=>{
            if(err) {
                winston.error("/delete/category/:id",err);
                return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
            } else {
                if(user.length == 0){
                    Location.findOne({_id: req.params.id, status: 'active'}).exec(function(err,cate){
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