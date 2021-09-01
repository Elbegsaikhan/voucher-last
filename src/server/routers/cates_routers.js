import winston from 'winston';
import Request from "../models/Request";
import Category from "../models/Category";
import Location from "../models/Location";
import User from "../models/User";
import Comment from "../models/Comment";
import Tution from "../models/Tution";
import News from "../models/News";
import auth from "../../auth";
import async from "async";
import mongoose from "mongoose";
import Product from "../models/Product";

module.exports = function (router) {
    router.get("/all/list", function (req, res) {
        Category.find({status: "active"}).exec(function (err, category) {
            if (err) {
                winston.error(err);
                return res
                    .status(200)
                    .json({success: false, message: "Aldaa CAtegory"});
            } else {
                if (category) {
                    return res.status(200).json({success: true, category});
                } else {
                    return res
                        .status(500)
                        .json({success: false, message: "Aldaa end vv"});
                }
            }
        });
    })
    router.get('/list', function (req, res) {
        function getData(cb) {
            if (req.query.cate && req.query.cate !== 'all') {
                Category.findOne({slug: req.query.cate}).lean().exec(function (err, cate) {
                    Category.find({parent: (cate || {})._id, status: 'active'}).lean().exec(function (err, cates) {
                        if (req.query.location && req.query.location !== 'all') {
                            Location.findOne({slug: req.query.location}).lean().exec(function (err, location) {
                                cb((cate || {})._id || null, cates || [], (location || {})._id || null);
                            });
                        } else {
                            cb((cate || {})._id || null, cates || [], null);
                        }
                    });
                });
            } else {
                if (req.query.location && req.query.location !== 'all') {
                    Location.findOne({slug: req.query.location}).lean().exec(function (err, location) {
                        cb(null, null, (location || {})._id || null);
                    });
                } else {
                    cb(null, null, null);
                }
            }
        }

        async.parallel([
            function (callback) {
                getData(function (cate, cates, location_id) {
                    let query = [{status: 'active'}, {role: 'company'}];
                    if (cate) {
                        query.push({category: {$in: [cate._id, ...(cates || []).map(item => item._id)]}})
                    }
                    if (location_id) {
                        query.push({location: location_id})
                    }
                    if (req.query.search && req.query.location !== '') {
                        query.push({name: {$regex: req.query.search, $options: 'i'}});
                    }
                    if (req.query.type && req.query.type !== '') {
                        query.push({membership: req.query.type});
                    }
                    User.find({$and: query}).sort({created: 1}).deepPopulate(['category', 'location']).lean().exec(function (err, result) {
                        callback(err, result);
                    });
                })
            },
            function (callback) {
                Category.find({status: 'active'}).sort({order: 1}).lean().exec(function (err, result) {
                    callback(err, result);
                });
            },
            function (callback) {
                Location.find({status: 'active'}).sort({order: 1}).lean().exec(function (err, result) {
                    callback(err, result);
                });
            },
        ], function (err, results) {
            if (err) {
                winston.error(err);
                return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
            } else {
                let parents = results[1].filter(item => item.parent == null || item.parent === '');
                let cates = parents.map(function (item) {
                    if (results[1].some(aa => ((aa.parent || {})._id || '').toString() === item._id.toString())) {
                        return {
                            ...item,
                            child: results[1].filter(b => ((b.parent || {})._id || '').toString() === item._id.toString()) || []
                        }
                    } else {
                        return item
                    }
                });

                let parents1 = results[2].filter(item => item.parent == null || item.parent === '');
                let cates1 = parents1.map(function (item) {
                    if (results[2].some(aa => ((aa.parent || {})._id || '').toString() === item._id.toString())) {
                        return {
                            ...item,
                            child: results[2].filter(b => ((b.parent || {})._id || '').toString() === item._id.toString()) || []
                        }
                    } else {
                        return item
                    }
                });
                return res.json({
                    success: true,
                    items: results[0] || [],
                    cates: cates || [],
                    locations: cates1 || [],
                });
            }
        })
    });
    router.get('/getCompany/:slug', function (req, res) {
        User.findOne({status: 'active', slug: req.params.slug}).lean().exec(function (err, user) {
            if (err) {
                winston.error(err);
                return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
            } else {
                if ((user || {})._id) {
                    async.parallel([
                        function (callback) {
                            User.findOne({status: 'active', _id: user._id}).lean().exec(function (err, result) {
                                callback(err, result);
                            });
                        },
                        function (callback) {
                            Tution.find({
                                status: 'active',
                                company: user._id
                            }).sort({order: 1}).deepPopulate(['group', 'group.title']).lean().exec(function (err, result) {
                                callback(err, result);
                            });
                        },
                        function (callback) {
                            News.find({status: 'active', company: user._id}).sort({order: 1}).lean().exec(function (err, result) {
                                callback(err, result);
                            });
                        },
                    ], function (err, results) {
                        if (err) {
                            winston.error(err);
                            return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                        } else if (results[0] && results[0]._id) {
                            return res.json({
                                success: true,
                                item: results[0] || {},
                                tutions: results[1] || [],
                                news: results[2] || [],
                            });
                        } else {
                            return res.json({
                                success: false,
                                item: results[0] || {},
                                tutions: results[1] || [],
                                news: results[2] || [],
                            });
                        }
                    })
                } else {
                    return res.json({
                        success: false,
                        item: {},
                        tutions: [],
                        news: [],
                    });
                }
            }
        });

    });
    router.get('/commentSubmit', auth.user, function (req, res) {
        if (req.query.tution && mongoose.Types.ObjectId.isValid(req.query.tution)) {
            Comment.find({status: 'active', tution: req.query.tution, user: req.user._id}).lean().exec(function (err, result) {
                if (err) {
                    winston.error(err);
                    return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                } else if ((result || []).length > 0) {
                    return res.status(200).json({success: false, message: 'Сэтгэгдэл үлдээсэн байна'});
                } else {
                    let comm = new Comment();
                    comm.tution = req.query.tution;
                    comm.user = req.user._id;
                    comm.comment = req.query.comment;
                    comm.status = 'active';
                    comm.save(function (err, data) {
                        if (err) {
                            winston.error(err);
                            return res.json({success: false, message: 'Системд алдаа гарлаа'});
                        }
                        if (data) {
                            return res.json({
                                success: true,
                                comment: data
                            });
                        } else {
                            return res.json({success: false, message: 'Системд алдаа гарлаа'});
                        }
                    });
                }
            });
        } else {
            return res.json({
                success: false,
            });
        }

    });
    router.get('/getTution/:id', function (req, res) {
        if (req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            async.parallel([
                function (callback) {
                    Tution.findOne({status: 'active', _id: req.params.id}).deepPopulate(['company']).lean().exec(function (err, result) {
                        callback(err, result);
                    });
                },
                function (callback) {
                    if ((req.user || {})._id) {
                        Request.findOne({
                            status: {$ne: 'delete'},
                            tution: req.params.id,
                            user: req.user._id
                        }).deepPopulate(['tution']).lean().exec(function (err, result) {
                            callback(err, result);
                        });
                    } else {
                        callback(null, null)
                    }
                },
                function (callback) {
                    Comment.find({status: 'active', tution: req.params.id}).deepPopulate(['user']).lean().exec(function (err, result) {
                        callback(err, result);
                    });
                },
            ], function (err, results) {
                if (err) {
                    winston.error(err);
                    return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                } else if (results[0] && results[0]._id) {
                    News.find({status: 'active', company: results[0].company._id}).sort({order: 1}).lean().exec(function (err, ss) {
                        return res.json({
                            success: true,
                            item: results[0].company || {},
                            tution: results[0] || {},
                            request: results[1] || null,
                            news: ss || [],
                            comments: results[2] || [],
                        });
                    });
                } else {
                    return res.json({
                        success: false,
                        item: {},
                        tution: {},
                        request: null,
                        news: [],
                        comments: [],
                    });
                }
            })
        } else {
            return res.json({
                success: false,
                item: {},
                tution: {},
                news: [],
                comments: [],
            });
        }

    });
    router.get('/requestTution/:id', auth.user, function (req, res) {
        let zeropad = function (n, l) {
            var ret, d, i;
            ret = n === null || n === undefined ? '' : n.toString();
            // do we need to pad or truncate?
            d = l - ret.length;
            if (d > 0) {
                for (i = 0; i < d; i++) {
                    ret = '0' + ret;
                }
            }
            return (ret);
        };
        if (req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
            async.parallel([
                function (callback) {
                    Request.findOne({
                        status: {$ne: 'delete'},
                        tution: req.params.id,
                        user: req.user._id
                    }).deepPopulate(['tution']).lean().exec(function (err, result) {
                        callback(err, result);
                    });
                },
                function (callback) {
                    Tution.findOne({status: 'active', _id: req.params.id}).lean().exec(function (err, result) {
                        callback(err, result);
                    });
                },
                function (callback) {
                    Request.count().exec(function (err, result) {
                        callback(err, result);
                    });
                },
            ], function (err, results) {
                if (err) {
                    winston.error(err);
                    return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                } else if (results[0] && results[0]._id) {
                    return res.json({
                        success: false,
                        message: 'Хүсэлт илгээсэн байна'
                    });
                } else {
                    let cate = new Request();
                    cate.tution = req.params.id;
                    cate.amount = results[1].price;
                    cate.user = req.user._id;
                    cate.sku = zeropad(results[2] + 1, 6);
                    cate.status = 'pending';
                    cate.save(function (err, data) {
                        if (err) {
                            winston.error(err);
                            return res.json({success: false, message: 'Системд алдаа гарлаа'});
                        }
                        if (data) {
                            return res.json({
                                success: true,
                                request: {
                                    tution: results[1],
                                    amount: data.amount,
                                    sku: data.sku,
                                }
                            });
                        } else {
                            return res.json({success: false, message: 'Системд алдаа гарлаа'});
                        }
                    });
                }
            })
        } else {
            return res.json({success: false, message: 'Системд алдаа гарлаа'});
        }
    });
};
