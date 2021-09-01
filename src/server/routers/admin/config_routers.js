import winston from 'winston';
import Config from "../../models/Config";
import path from 'path';
import auth from "../../../auth";
import moment from 'moment';
import Jimp from "jimp";
import fs from "fs";
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";


module.exports = function (router) {
    router.get('/get/config', auth.admin ,function (req,res) {
        Config.findOne({status: 'active'}).exec(function(err,result){
            if(err) {
                winston.error(err);
                return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
            }
            if(result) {
                return res.json({success: true,result: result});
            } else {
                return res.json({success: false});
            }
        });
    });
    router.post('/save/about', auth.admin, [
        check('logo')
            .not()
            .isEmpty()
            .withMessage('Зураг оруулна уу')
            .trim(),
        check('logo1')
            .not()
            .isEmpty()
            .withMessage('Зураг оруулна уу')
            .trim(),
        check('background')
            .not()
            .isEmpty()
            .withMessage('Зураг оруулна уу')
            .trim(),
        check('homeImage')
            .not()
            .isEmpty()
            .withMessage('Зураг оруулна уу')
            .trim(),
        check('homeBanner1')
            .not()
            .isEmpty()
            .withMessage('Зураг оруулна уу')
            .trim(),
        check('homeBanner2')
            .not()
            .isEmpty()
            .withMessage('Зураг оруулна уу')
            .trim(),
    ] ,function (req,res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({success:false,message: errors.array()[0].msg});
        }
        let data = matchedData(req);
        function logo1Fc(callback) {
            if(req.body.newLogo1) {
                let input = path.resolve(__dirname,"../../../../static"+data.logo1);
                let out = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM'));
                fs.mkdir(out,function(e){
                    Jimp.read(input, function (err, image) {
                        if(err){
                            winston.error('jump read error',err);
                            res.json({success: false, msg: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                        if(image){
                            image.quality(70);
                            let image_url = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM')+'/'+data.logo1.replace('/tmp/', ''));
                            image.write(image_url,function(err){
                                if(err){
                                    winston.error('upload write error',err);
                                    res.json({success: false, msg: "Зураг хадгалж чадсангүй"});
                                }else{
                                    callback(`/uploads/${moment().format('YYYY')}/${moment().format('MM')}/${data.logo1.replace('/tmp/', '')}`);
                                }
                            });
                        }else{
                            res.json({success: false, message: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                    });
                });
            } else {
                callback(data.logo1);
            }
        }
        function logoFc(callback) {
            if(req.body.newLogo) {
                let input = path.resolve(__dirname,"../../../../static"+data.logo);
                let out = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM'));
                fs.mkdir(out,function(e){
                    Jimp.read(input, function (err, image) {
                        if(err){
                            winston.error('jump read error',err);
                            res.json({success: false, msg: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                        if(image){
                            image.quality(70);
                            let image_url = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM')+'/'+data.logo.replace('/tmp/', ''));
                            image.write(image_url,function(err){
                                if(err){
                                    winston.error('upload write error',err);
                                    res.json({success: false, msg: "Зураг хадгалж чадсангүй"});
                                }else{
                                    callback(`/uploads/${moment().format('YYYY')}/${moment().format('MM')}/${data.logo.replace('/tmp/', '')}`);
                                }
                            });
                        }else{
                            res.json({success: false, message: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                    });
                });
            } else {
                callback(data.logo);
            }
        }
        function logoHomeImage(callback) {
            if(req.body.newHomeImage) {
                let input = path.resolve(__dirname,"../../../../static"+data.homeImage);
                let out = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM'));
                fs.mkdir(out,function(e){
                    Jimp.read(input, function (err, image) {
                        if(err){
                            winston.error('jump read error',err);
                            res.json({success: false, msg: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                        if(image){
                            image.quality(70);
                            let image_url = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM')+'/'+data.homeImage.replace('/tmp/', ''));
                            image.write(image_url,function(err){
                                if(err){
                                    winston.error('upload write error',err);
                                    res.json({success: false, msg: "Зураг хадгалж чадсангүй"});
                                }else{
                                    callback(`/uploads/${moment().format('YYYY')}/${moment().format('MM')}/${data.homeImage.replace('/tmp/', '')}`);
                                }
                            });
                        }else{
                            res.json({success: false, message: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                    });
                });
            } else {
                callback(data.homeImage);
            }
        }
        function logoHomeBanner1(callback) {
            if(req.body.newHomeBanner1) {
                let input = path.resolve(__dirname,"../../../../static"+data.homeBanner1);
                let out = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM'));
                fs.mkdir(out,function(e){
                    Jimp.read(input, function (err, image) {
                        if(err){
                            winston.error('jump read error',err);
                            res.json({success: false, msg: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                        if(image){
                            image.quality(70);
                            let image_url = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM')+'/'+data.homeBanner1.replace('/tmp/', ''));
                            image.write(image_url,function(err){
                                if(err){
                                    winston.error('upload write error',err);
                                    res.json({success: false, msg: "Зураг хадгалж чадсангүй"});
                                }else{
                                    callback(`/uploads/${moment().format('YYYY')}/${moment().format('MM')}/${data.homeBanner1.replace('/tmp/', '')}`);
                                }
                            });
                        }else{
                            res.json({success: false, message: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                    });
                });
            } else {
                callback(data.homeBanner1);
            }
        }
        function logoHomeBanner2(callback) {
            if(req.body.newHomeBanner2) {
                let input = path.resolve(__dirname,"../../../../static"+data.homeBanner2);
                let out = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM'));
                fs.mkdir(out,function(e){
                    Jimp.read(input, function (err, image) {
                        if(err){
                            winston.error('jump read error',err);
                            res.json({success: false, msg: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                        if(image){
                            image.quality(70);
                            let image_url = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM')+'/'+data.homeBanner2.replace('/tmp/', ''));
                            image.write(image_url,function(err){
                                if(err){
                                    winston.error('upload write error',err);
                                    res.json({success: false, msg: "Зураг хадгалж чадсангүй"});
                                }else{
                                    callback(`/uploads/${moment().format('YYYY')}/${moment().format('MM')}/${data.homeBanner2.replace('/tmp/', '')}`);
                                }
                            });
                        }else{
                            res.json({success: false, message: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                    });
                });
            } else {
                callback(data.homeBanner2);
            }
        }
        function logoBg(callback) {
            if(req.body.newBackground) {
                let input = path.resolve(__dirname,"../../../../static"+data.background);
                let out = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM'));
                fs.mkdir(out,function(e){
                    Jimp.read(input, function (err, image) {
                        if(err){
                            winston.error('jump read error',err);
                            res.json({success: false, msg: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                        if(image){
                            image.quality(70);
                            let image_url = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM')+'/'+data.background.replace('/tmp/', ''));
                            image.write(image_url,function(err){
                                if(err){
                                    winston.error('upload write error',err);
                                    res.json({success: false, msg: "Зураг хадгалж чадсангүй"});
                                }else{
                                    callback(`/uploads/${moment().format('YYYY')}/${moment().format('MM')}/${data.background.replace('/tmp/', '')}`);
                                }
                            });
                        }else{
                            res.json({success: false, message: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                    });
                });
            } else {
                callback(data.background);
            }
        }
        logoFc(function (logoPath) {
            logo1Fc(function (logo1Path) {
                logoBg(function (backgroundPath) {
                    logoHomeImage(function (homeImage) {
                        logoHomeBanner1(function (homeBanner1) {
                            logoHomeBanner2(function (homeBanner2) {
                                if(req.body._id === 0) {
                                    let config = new Config();
                                    config.title = req.body.title;
                                    config.description = req.body.description;
                                    config.logo = logoPath;
                                    config.logo1 = logo1Path;
                                    config.background = backgroundPath;
                                    config.homeImage = homeImage;
                                    config.homeBanner1 = homeBanner1;
                                    config.homeBanner2 = homeBanner2;
                                    config.phone = req.body.phone;
                                    config.email = req.body.email;
                                    config.address = req.body.address;
                                    config.footerText = req.body.footerText;
                                    config.facebook = req.body.facebook;
                                    config.instagram = req.body.instagram;
                                    config.youtube = req.body.youtube;
                                    config.save(function (err, data) {
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
                                    Config.findOne({_id: req.body._id}).exec(function(err,config){
                                        if(err) {
                                            winston.error(err);
                                            return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                                        }
                                        if(config) {
                                            config.title = req.body.title;
                                            config.description = req.body.description;
                                            config.logo = logoPath;
                                            config.logo1 = logo1Path;
                                            config.background = backgroundPath;
                                            config.homeImage = homeImage;
                                            config.homeBanner1 = homeBanner1;
                                            config.homeBanner2 = homeBanner2;
                                            config.phone = req.body.phone;
                                            config.email = req.body.email;
                                            config.address = req.body.address;
                                            config.footerText = req.body.footerText;
                                            config.facebook = req.body.facebook;
                                            config.instagram = req.body.instagram;
                                            config.youtube = req.body.youtube;
                                            config.dans = req.body.dans;
                                            config.dansNer = req.body.dansNer;
                                            config.amount = req.body.amount;
                                            config.save(function (err, data) {
                                                if(err) {
                                                    winston.error(err);
                                                    return res.json({success: false, message: 'Системд алдаа гарлаа'});
                                                }
                                                if(data) {
                                                    return res.json({success: true, sucmod: true, message: 'Амжилттай хадгалагдлаа', result: data});
                                                } else {
                                                    return res.json({success: false, message: 'Системд алдаа гарлаа'});
                                                }
                                            });
                                        } else {
                                            return res.json({success: false, message: 'About олдсонгүй'});
                                        }
                                    });
                                }
                            })
                        })
                    })
                })
            })
        })
    });
};