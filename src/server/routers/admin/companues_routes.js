import auth from "../../../auth";

import User from "../../models/User";
import winston from 'winston';
import { check, validationResult } from "express-validator/check";
import { matchedData } from "express-validator/filter";
import path from 'path';
import moment from 'moment';
import Jimp from "jimp";
import fs from "fs";
import slug from 'slug'
import async from "async";
import Category from "../../models/Category";
import Location from "../../models/Location";
module.exports = function (router) {

    router.get('/companies/:current', auth.company, function (req, res) {
        let start = parseInt(req.params.current);
        if (isNaN(start)) {
            start = 0;
        }
        async.parallel([
            function (callback) {
                if (req.user.role === 'company') {
                    User.find({ status: { $ne: 'delete' }, role: 'company', _id: req.user._id }).exec(function (err, result) {
                        callback(err, result);
                    });
                } else {
                    User.find({ status: { $ne: 'delete' }, role: 'company' }).skip(start * 30).limit(30).exec(function (err, result) {
                        callback(err, result);
                    });
                }
            },
            function (callback) {
                if (req.user.role === 'company') {
                    callback(null, 0);
                } else {
                    User.count({ status: { $ne: 'delete' }, role: 'company' }, function (err, result) {
                        callback(err, result)
                    })
                }
            },
            function (callback) {
                Category.find({ status: 'active' }).lean().exec(function (err, result) {
                    callback(err, result);
                });
            },
            function (callback) {
                Location.find({ status: 'active' }, function (err, result) {
                    callback(err, result)
                })
            },
        ], function (err, results) {
            if (err) {
                winston.error(err);
                return res.status(200).json({ success: false, message: '?????????????? ?????????? ????????????' });
            } else {
                let parents = results[2].filter(item => item.parent == null || item.parent === '');
                let cates = parents.map(function (item) {
                    if (results[2].some(aa => ((aa.parent || {})._id || '').toString() === item._id.toString())) {
                        return {
                            ...item,
                            child: results[2].filter(b => ((b.parent || {})._id || '').toString() === item._id.toString()) || []
                        }
                    } else {
                        return item
                    }
                });
                return res.json({ success: true, items: results[0] || [], all: results[1], categories: cates, locations: results[3] });
            }
        })
    });
    router.post('/company/action', auth.company, [
        check('_id')
            .trim(),
        check('name')
            .not()
            .isEmpty()
            .withMessage('?????? ?????????????? ????')
            .trim(),
        check('location')
            .not()
            .isEmpty()
            .withMessage('?????????????? ?????????????? ????')
            .trim(),
        check('category')
            .not()
            // .isEmpty()
            // .withMessage('?????????????? ?????????????? ????')
            .trim(),
        check('membership')
            .not()
            .isEmpty()
            .withMessage('?????????? ?????????????? ????')
            .trim(),
        check('status')
            .not()
            .isEmpty()
            .withMessage('?????????? ?????????????? ????')
            .trim(),
        check('bio'),
        check('email'),
        check('slug'),
        check('phone')
            .not()
            .isEmpty()
            .withMessage('???????? ?????????????? ????')
            .trim(),
        check('account'),
        check('bankName'),
        check('accountName'),
        check('facebook'),
        check('instagram'),
        check('youtube'),
        check('newImage')
            .trim(),
        check('image')
            .not()
            .isEmpty()
            .withMessage('???????????? ?????????? ?????????????? ????')
            .trim(),
        check('newLogo')
            .trim(),
        check('logo')
            .not()
            .isEmpty()
            .withMessage('???????? ?????????????? ????')
            .trim(),
    ], function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({ success: false, message: errors.array()[0].msg });
        }
        let data = matchedData(req);
        function imageFc(callback) {
            if (req.body.newImage) {
                let input = path.resolve(__dirname, "../../../../static" + data.image);
                let out = path.resolve(__dirname, "../../../../static/uploads/" + moment().format('YYYY') + '/' + moment().format('MM'));
                fs.mkdir(out, function (e) {
                    Jimp.read(input, function (err, image) {
                        if (err) {
                            winston.error('jump read error', err);
                            res.json({ success: false, msg: "?????????? ???????????? ?????????? ?????????? ?????????? ?????????????? ????" })
                        }
                        if (image) {
                            image.quality(70);
                            let image_url = path.resolve(__dirname, "../../../../static/uploads/" + moment().format('YYYY') + '/' + moment().format('MM') + '/' + data.image.replace('/tmp/', ''));
                            image.write(image_url, function (err) {
                                if (err) {
                                    winston.error('upload write error', err);
                                    res.json({ success: false, msg: "?????????? ?????????????? ??????????????????" });
                                } else {
                                    callback(`/uploads/${moment().format('YYYY')}/${moment().format('MM')}/${data.image.replace('/tmp/', '')}`);
                                }
                            });
                        } else {
                            res.json({ success: false, message: "?????????? ???????????? ?????????? ?????????? ?????????? ?????????????? ????" })
                        }
                    });
                });
            } else {
                callback(data.image);
            }
        }
        function logoFc(callback) {
            if (req.body.newLogo) {
                let input = path.resolve(__dirname, "../../../../static" + data.logo);
                let out = path.resolve(__dirname, "../../../../static/uploads/" + moment().format('YYYY') + '/' + moment().format('MM'));
                fs.mkdir(out, function (e) {
                    Jimp.read(input, function (err, image) {
                        if (err) {
                            winston.error('jump read error', err);
                            res.json({ success: false, msg: "?????????? ???????????? ?????????? ?????????? ?????????? ?????????????? ????" })
                        }
                        if (image) {
                            image.quality(70);
                            let image_url = path.resolve(__dirname, "../../../../static/uploads/" + moment().format('YYYY') + '/' + moment().format('MM') + '/' + data.logo.replace('/tmp/', ''));
                            image.write(image_url, function (err) {
                                if (err) {
                                    winston.error('upload write error', err);
                                    res.json({ success: false, msg: "?????????? ?????????????? ??????????????????" });
                                } else {
                                    callback(`/uploads/${moment().format('YYYY')}/${moment().format('MM')}/${data.logo.replace('/tmp/', '')}`);
                                }
                            });
                        } else {
                            res.json({ success: false, message: "?????????? ???????????? ?????????? ?????????? ?????????? ?????????????? ????" })
                        }
                    });
                });
            } else {
                callback(data.logo);
            }
        }
        if (req.body._id === 0) {
            imageFc(function (imagePath) {
                logoFc(function (logoPath) {
                    let sl = slug(data.slug || data.title);
                    let regex = new RegExp("^" + sl, "i");
                    User.find({ slug: regex }).exec((rr, nn) => {
                        if (nn && nn.length > 0) {
                            sl = `${sl}-${nn.length}`;
                        }
                        let news = new User();
                        news.name = data.name;
                        news.bio = data.bio;
                        news.slug = sl;
                        news.image = imagePath;
                        news.logo = logoPath;
                        news.email = data.email;
                        news.phone = data.phone;
                        news.account = data.account;
                        news.bankName = data.bankName;
                        news.accountName = data.accountName;
                        news.facebook = data.facebook;
                        news.instagram = data.instagram;
                        news.youtube = data.youtube;
                        news.location = data.location;
                        news.category = data.category;
                        news.status = data.status;
                        news.membership = data.membership;
                        news.save(function (err, ssss) {
                            if (err) {
                                winston.error(err);
                                return res.json({ success: false, message: '?????????????? ?????????? ????????????' });
                            }
                            if (data) {
                                return res.json({ success: true, sucmod: true, message: '?????????????????? ????????????????????????', result: ssss, edit: false });
                            } else {
                                return res.json({ success: false, message: '?????????????? ?????????? ????????????' });
                            }
                        });
                    })
                })
            })
        } else {
            imageFc(function (imagePath) {
                logoFc(function (logoPath) {
                    User.findOne({ _id: req.body._id }).exec(function (err, news) {
                        if (err) {
                            winston.error(err);
                            return res.status(200).json({ success: false, message: '?????????????? ?????????? ????????????' });
                        }
                        if (news) {
                            news.name = data.name;
                            news.bio = data.bio;
                            news.image = imagePath;
                            news.logo = logoPath;
                            news.email = data.email;
                            news.phone = data.phone;
                            news.account = data.account;
                            news.bankName = data.bankName;
                            news.accountName = data.accountName;
                            news.facebook = data.facebook;
                            news.instagram = data.instagram;
                            news.youtube = data.youtube;
                            news.location = data.location;
                            news.category = data.category;
                            news.status = data.status;
                            news.membership = data.membership;
                            if (news.slug !== data.slug) {
                                let sl = slug(data.slug || data.title);
                                let regex = new RegExp("^" + sl, "i");
                                User.find({ slug: regex }).exec((rr, nn) => {
                                    if (nn && nn.length > 0) {
                                        sl = `${sl}-${nn.length}`;
                                    }
                                    news.slug = sl;
                                    news.save(function (err, data) {
                                        if (err) {
                                            winston.error(err);
                                            return res.json({ success: false, message: '?????????????? ?????????? ????????????' });
                                        }
                                        if (data) {
                                            return res.json({ success: true, sucmod: true, message: '?????????????????? ????????????????????????', result: data, edit: true });
                                        } else {
                                            return res.json({ success: false, message: '?????????????? ?????????? ????????????' });
                                        }
                                    });
                                })
                            } else {
                                news.save(function (err, data) {
                                    if (err) {
                                        winston.error(err);
                                        return res.json({ success: false, message: '?????????????? ?????????? ????????????' });
                                    }
                                    if (data) {
                                        return res.json({ success: true, sucmod: true, message: '?????????????????? ????????????????????????', result: data, edit: true });
                                    } else {
                                        return res.json({ success: false, message: '?????????????? ?????????? ????????????' });
                                    }
                                });
                            }
                        } else {
                            return res.json({ success: false, message: '?????????????????????? ??????????????????' });
                        }
                    });
                })
            })
        }
    });
    router.get('/delete/company/:id', auth.company, async (req, res) => {
        await User.updateOne({ _id: data._id }, { first_name: 'Test update' }).exec((err, res) => {
            console.log('Err', err, 'res', res)
        })
        // User.findOne({_id: req.params.id}).exec(function(err,news){
        //     if(err) {
        //         winston.error(err);
        //         return res.status(200).json({success: false, message: '?????????????? ?????????? ????????????'});
        //     }
        //     if(news) {
        //         news.status = 'delete';
        //         news.save(function (err, data) {
        //             if(err) {
        //                 winston.error(err);
        //                 return res.json({success: false, message: '?????????????? ?????????? ????????????'});
        //             }
        //             if(data) {
        //                 return res.json({success: true, sucmod: true, message: '?????????????????? ??????????????????????', id: req.params.id});
        //             } else {
        //                 return res.json({success: false, message: '?????????????? ?????????? ????????????'});
        //             }
        //         });
        //     } else {
        //         return res.json({success: false, message: 'News ??????????????????'});
        //     }
        // });
    });
    router.get('/get/company/:id', auth.company, function (req, res) {
        User.findOne({ _id: req.params.id }).exec(function (err, result) {
            if (err) {
                winston.error(err);
                return res.status(200).json({ success: false, message: '?????????????? ?????????? ????????????' });
            }
            if (result) {
                return res.json({ success: true, result });
            } else {
                return res.json({ success: false, message: '??????????????????' });
            }
        });
    });
};
