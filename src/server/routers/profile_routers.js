import winston from 'winston';
import bcrypt from 'bcrypt-node';
import User from "../models/User";
import Request from "../models/Request";
import auth from "../../auth";
import nodemailer from "nodemailer";
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";

module.exports = function (router) {
    router.get('/getRequests', auth.user, function (req, res) {
        console.log("Profile routers")
        Request.find({status: {$ne : 'delete'}, user: req.user._id}).sort({created : -1}).deepPopulate(['tution']).lean().exec(function(err,results){
            if(err) {
                winston.error(err);
                return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
            } else {
                return res.json({
                    success: true,
                    items: results || [],
                });
            }
        });
    });
    router.post('/change/info/:id', auth.user , [
        check('first_name')
            .not()
            .isEmpty()
            .withMessage('Нэр оруулна уу')
            .trim(),
        check('last_name')
            .not()
            .isEmpty()
            .withMessage('Овог оруулна уу')
            .trim(),
        check('email')
            .not()
            .isEmpty()
            .withMessage('Имэйл хаяг оруулна уу')
            .isEmail()
            .withMessage('Имэйл буруу байна')
            .trim(),
        check('phone')
            .optional({ checkFalsy: true })
            .isNumeric()
            .withMessage('Утасны дугаар буруу байна')
            .isLength({ min: 8, max: 8 })
            .withMessage('Утасны дугаар буруу байна')
            .trim(),
        check('birthday')
            .not()
            .isEmpty()
            .withMessage('Төрсөн өдөр оруулна уу')
            .trim(),
        check('company')
            .trim(),
        check('profession')
            .trim(),
        check('more')
            .trim(),
    ], function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({success: false, msg: errors.array()[0].msg});
        }
        let data = matchedData(req);
        let or = [
            {email: data.email}
        ];
        if(req.user._id.toString() === req.params.id.toString() && req.user.role === 'user') {
            User.find({$or: or }).exec( function(err, users) {
                if(err) {
                    winston.error(err);
                    return res.status(200).json({success: false,msg: 'Системд алдаа гарлаа'});
                } else {
                    if(users && users.length > 0) {
                        let aa = users.filter( ww => ww._id.toString() !== req.user._id.toString());
                        if(aa && aa.length > 0) {
                            return res.status(200).json({success: false,msg: 'Имэйл давхцаж байна'});
                        } else {
                            let set = { $set: {
                                    email: data.email,
                                    phone: data.phone,
                                    first_name: data.first_name,
                                    last_name: data.last_name,
                                    birthday: data.birthday,
                                    company: data.company,
                                    profession: data.profession,
                                    more: data.more,
                                }};
                            User.findOneAndUpdate({_id: req.user._id}, set, {new: true}).lean().exec(function (err, user) {
                                if(err) {
                                    winston.error(err);
                                    return res.status(200).json({success: false,msg: 'Системд алдаа гарлаа'});
                                } else {
                                    return res.status(200).json({success: true, sucmod: true, user: user, msg: 'Амжилттай хадгалагдлаа'});
                                }
                            })
                        }
                    } else {
                        let set = { $set: {
                                email: data.email,
                                phone: data.phone,
                                first_name: data.first_name,
                                last_name: data.last_name,
                                birthday: data.birthday,
                                company: data.company,
                                profession: data.profession,
                                more: data.more
                            }};
                        User.findOneAndUpdate({_id: req.user._id}, set, {new: true}).lean().exec(function (err, user) {
                            if(err) {
                                winston.error(err);
                                return res.status(200).json({success: false,msg: 'Системд алдаа гарлаа'});
                            } else {
                                return res.status(200).json({success: true, sucmod: true, user: user, msg: 'Амжилттай хадгалагдлаа'});
                            }
                        })
                    }
                }
            });
        } else {
            return res.status(404).json({msg: 'Хандах эрхгүй байна'});
        }
    });
    router.post('/change/pass/:id', auth.user , function (req, res) {
        if(req.user._id.toString() === req.params.id.toString()) {
            User.findOne({_id: req.user._id }).exec( function(err, user) {
                if(err) {
                    winston.error(err);
                    return res.status(200).json({success: false,msg: 'Системд алдаа гарлаа'});
                } else {
                    var ps = user.password.replace("$2y$", "$2a$");
                    if(user && bcrypt.compareSync(req.body.password, ps)) {
                        if(req.body.newPassword === req.body.newPasswordRepeat) {
                            user.password = bcrypt.hashSync(req.body.newPassword);
                            user.save(function (err, data) {
                                if(err) {
                                    winston.error(err);
                                    return res.status(200).json({success: false,msg: 'Системд алдаа гарлаа'});
                                } else {
                                    return res.status(200).json({success: true, sucmod: true, user: user, msg: 'Амжилттай хадгалагдлаа'});
                                }
                            });
                        } else {
                            return res.status(200).json({success: false, msg: 'Шинэ нууц үг зөрж байна'});
                        }
                    } else {
                        return res.status(200).json({success: false, msg: 'Нууц үг буруу байна'});
                    }
                }
            });
        } else {
            return res.status(404).json({msg: 'Хандах эрхгүй байна'});
        }
    });
};
