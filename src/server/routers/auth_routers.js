import winston from 'winston';
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";
import User from "../models/User";
import Category from "../models/Category";
import Location from "../models/Location";
import bcrypt from "bcrypt-node";
import jwt from "jsonwebtoken";
import config from "../../config";

let nodemailer = require('nodemailer');

const env = process.env.NODE_ENV;
module.exports = function (router) {
    router.get('/logout', function (req, res) {
        res.clearCookie('token');
        return res.redirect("/");
    });


    router.get('/get_cates', function (req, res) {
        Category.find({status: 'active'}, function (err, user) {
            if (err) {
                winston.error('/verify/:token update error', err);
                return res.json({success: false, message: 'Идэвхижүүлэхэд алдаа гарлаа'});
            } else {
                Location.find({status: 'active'}, function (err, location) {
                    if (err) {
                        winston.error('/verify/:token update error', err);
                        return res.json({success: false, message: 'Идэвхижүүлэхэд алдаа гарлаа'});
                    } else {
                        return res.json({success: true, cates: user || [], location: location || []});
                    }
                });
            }
        });
    });

    router.post('/login', [
        check('email')
            .not()
            .isEmpty()
            .withMessage('Имэйл хаяг оруулна уу')
            .isEmail()
            .withMessage('Имэйл буруу байна')
            .trim(),
        check('password')
            .not()
            .isEmpty()
            .withMessage('Нууц үг оруулна уу')
            .trim(),
        check('link')
            .trim(),
    ], function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({success: false, message: errors.array()[0].msg});
        }
        let data = matchedData(req);
        console.log("data", data)
        let link = data.link && data.link
        User.findOne({email: data.email}, function (err, user) {
            if (err) {
                winston.error(err)
            }
            if (!user) {
                return res.json({success: false, message: 'Хэргэлэгч олдсонгүй'});
            } else {
                let ps = user.password.replace("$2y$", "$2a$");
                if (bcrypt.compareSync(data.password, ps)) {
                    if (user.status === 'active') {
                        let token = jwt.sign({id: user._id}, config.jwt_secret, {
                            expiresIn: 60 * 60 * 24
                        });
                        res.cookie('token', token, {maxAge: 86400000});

                        return res.status(200).json({
                            success: true, token, user, sucmod: true, message: 'Системд' +
                                ' нэвтэрлээ', link
                        });
                    } else if (user.status === 'pending') {
                        return res.status(200).json({
                            success: true,
                            email: user.email,
                            pending: true,
                            sucmod: true,
                            message: 'Идэвхижүүлэх шаардлагатай'
                        });
                    } else {
                        return res.status(200).json({success: false, message: 'Идэвхгүй хэргэлэгч байна'});
                    }
                } else {
                    return res.status(200).json({success: false, message: 'Нууц үг буруу байна'});
                }
            }
        });
    });
    router.post('/register', [
        check('email')
            .not()
            .isEmpty()
            .withMessage('Имэйл хаяг оруулна уу')
            .isEmail()
            .withMessage('Имэйл буруу байна')
            .trim(),
        check('password')
            .not()
            .isEmpty()
            .withMessage('Нууц үг оруулна уу')
            .trim(),
        check('passwordRepeat')
            .not()
            .isEmpty()
            .withMessage('Нууц үг давтах оруулна уу')
            .trim(),
    ], function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({success: false, message: errors.array()[0].msg});
        }
        let data = matchedData(req);
        User.findOne({email: data.email}, function (err, user) {
            if (err) {
                winston.error('/register findOne error', err);
                return res.json({success: false, message: 'Системд алдаа гарлаа'});
            }
            if (user) {
                res.json({success: false, message: 'Имэйл давхцаж байна.'});
            } else {
                user = new User();
                user.email = data.email;
                user.password = bcrypt.hashSync(data.password);
                user.status = 'active';
                user.created_at = Date.now();
                user.role = 'user';
                user.save(function (err, data) {
                    if (err) {
                        winston.error('/register user save error', err);
                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                    } else {
                        let token = jwt.sign({id: data._id}, config.jwt_secret, {
                            expiresIn: 60 * 60 * 24
                        });
                        res.cookie('token', token, {maxAge: 86400000});
                        return res.status(200).json({success: true});
                    }
                });
            }
        });
    });
    router.post('/registerCompany', [
        check('email')
            .not()
            .isEmpty()
            .withMessage('Имэйл хаяг оруулна уу')
            .isEmail()
            .withMessage('Имэйл буруу байна')
            .trim(),
        check('name')
            .not()
            .isEmpty()
            .withMessage('Байгууллагын нэр оруулна уу')
            .trim(),
        check('phone')
            .not()
            .isEmpty()
            .withMessage('Утасны дугаар оруулна уу')
            .trim(),
        check('password')
            .not()
            .isEmpty()
            .withMessage('Нууц үг оруулна уу')
            .trim(),
        check('passwordRepeat')
            .not()
            .isEmpty()
            .withMessage('Нууц үг давтах оруулна уу')
            .trim(),
    ], function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({success: false, message: errors.array()[0].msg});
        }
        let data = matchedData(req);
        User.findOne({email: data.email}, function (err, user) {
            if (err) {
                winston.error('/register findOne error', err);
                return res.json({success: false, message: 'Системд алдаа гарлаа'});
            }
            if (user) {
                res.json({success: false, message: 'Имэйл давхцаж байна.'});
            } else {
                user = new User();
                user.email = data.email;
                user.password = bcrypt.hashSync(data.password);
                user.name = data.name;
                user.phone = data.phone;
                user.status = 'pending';
                user.created_at = Date.now();
                user.role = 'company';
                user.save(function (err, data) {
                    if (err) {
                        winston.error('/register user save error', err);
                        return res.json({success: false, message: 'Системд алдаа гарлаа'});
                    } else {
                        let token = jwt.sign({id: data._id}, config.jwt_secret, {
                            expiresIn: 60 * 60 * 24
                        });
                        res.cookie('token', token, {maxAge: 86400000});
                        return res.status(200).json({success: true});
                    }
                });
            }
        });
    });
    router.post('/verify/:token', function (req, res) {
        jwt.verify(req.params.token, config.jwt_secret, {ignoreExpiration: true}, function (err, decoded) {
            if (err) {
                winston.error('/verify/:token 1 error', err);
                return res.json({success: false, message: 'Идэвхижүүлэхэд алдаа гарлаа'});
            } else {
                User.findOneAndUpdate({_id: decoded.id}, {status: 'active'}, {new: true}, function (err, user) {
                    if (err) {
                        winston.error('/verify/:token update error', err);
                        return res.json({success: false, message: 'Идэвхижүүлэхэд алдаа гарлаа'});
                    } else if (user) {
                        return res.json({success: true, username: user.username});
                    } else {
                        return res.json({success: false, message: 'Амжилтгүй. Нэвтэх үйлдэл хйиж дахин имэйл авна уу.'});
                    }
                });
            }
        });
    });
    router.post('/resend/email', function (req, res) {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'vouchers.mn@gmail.com',
                pass: 'surgaltuud#8'
            }
        });
        let token = req.body.accessToken;
        let mailOptions = {
            to: req.body.email,
            subject: 'Vouchers.mn',
            text: `<a href="http://vouchers.mn/verify/${token}">Идэвхжүүлэх</a>`,
            html: `<table width="100%" style="margin: auto; background-color: #f0f0f0;"><tr style="background-color: #313356;"><td> </td> </tr> <tr style="width: 500px;margin: 10px auto;display: block; padding: 15px 0px;"> <td>Odosury.com Сайтад бүртгүүлсэнд баярлалаа. Идэвхжүүлэх дээр дарж бүртгэлээ идэвхжүүлээрэй.</td></tr><tr style="width: 500px;margin: 10px auto;display: block;"> <td>Нэвтрэх холбоос.</td> </tr> <tr> <td> <center><a href="http://surgaltuud.mn/verify/${token}" style="    display: inline-block;border-radius: 6px;background-color: #313356 !important;border-collapse: collapse!important;max-width: 100%!important;font-weight: bold;font-size: 18px;color: #fff; text-decoration:none ;margin: 20px auto 60px;padding: 15px 20px;">Идэвхжүүлэх</a> </center></td> </tr> </table>`
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                winston.error('/register email send error', err);
                return res.json({success: false, message: 'Системд алдаа гарлаа'});
            } else {
                return res.json({success: true, mailSent: true});
            }
        });
    });

    router.post('/password/reset', [
        check('email')
            .not()
            .isEmpty()
            .withMessage('Имэйл хаяг оруулна уу')
            .isEmail()
            .withMessage('Имэйл буруу байна')
            .trim(),
    ], function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({success: false, message: errors.array()[0].msg});
        }
        let data = matchedData(req);
        User.findOne({email: data.email}, function (err, user) {
            if (err) {
                winston.error('/register findOne error', err);
                return res.json({success: false, message: 'Системд алдаа гарлаа'});
            }
            if (user) {
                let transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'info@odosury.com',
                        pass: 'odosury88'
                    }
                });
                let token = jwt.sign({id: user._id}, config.jwt_secret, {
                    expiresIn: 60 * 60 * 24
                });
                let mailOptions = {
                    to: req.body.email,
                    subject: 'Vouchers.mn',
                    text: `<a href="http://vouchers.mn/api/reset/password/${'token'}">Нууц үг солих</a>`,
                    html: `<table width="100%" style="margin: auto; background-color: #f0f0f0;"><tr style="background-color: #4bbf6b;"><td> </td> </tr> <tr style="width: 500px;margin: 10px auto;display: block; padding: 15px 0px;"> <td>Бид таны Surgaltuud.mn-ийн бүртгэлийн мэдээллээ сэргээх хүсэлтийг хүлээн авлаа.</td></tr><tr style="width: 500px;margin: 10px auto;display: block;"> <td>Нууц үг сэргээх бол энд дарана уу.</td> </tr> <tr> <td> <center><a href="http://surgaltuud.mn/api/reset/password/${token}" style="    display: inline-block;border-radius: 6px;background-color: #4bbf6b !important;border-collapse: collapse!important;max-width: 100%!important;font-weight: bold;font-size: 18px;color: #fff; text-decoration:none ;margin: 20px auto 60px;padding: 15px 20px;">Нууц үг сэргээх</a> </center></td> </tr> </table>`
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        winston.error('/register email send error', err);
                        return res.json({success: false, message: 'Имэйл илгээхэд алдаа гарлаа'});
                    } else {
                        return res.json({success: true, message: 'Амжилттай. Имэйл хаягаа шалгана уу', sucmod: true});
                    }
                });
            } else {
                return res.json({success: false, message: 'Таарах хэргэдэгч орлдсонгүй'});
            }
        });
    });
    router.get('/reset/password/:token', function (req, res) {
        jwt.verify(req.params.token, config.jwt_secret, function (err, decoded) {
            if (err) {
                winston.error('/reset/password/:id error: ', err);
                return res.json({success: false, message: 'Token хугацаа дууссан байна'});
            } else {
                User.findOne({_id: decoded.id}, function (err, user) {
                    if (err) {
                        winston.error('/register email send error', err);
                        return res.json({success: false, message: 'Имэйл илгээхэд алдаа гарлаа'});
                    } else if (user) {
                        const initialState = {
                            main: {
                                user: req.user || null,
                                services: req.services || null,
                                servicesCategories: req.servicesCategories || null,
                                config: req.config || null,
                                userReset: user,
                                token: req.params.token,
                            }
                        };
                        res.header("Content-Type", "text/html; charset=utf-8");
                        res.status(200).end(renderIndex(initialState));
                    } else {
                        return res.json({success: false, message: 'Таарах хэргэдэгч орлдсонгүй'});
                    }
                });
            }
        });
    });
    router.post('/reset/passwordSave/:id', function (req, res) {
        jwt.verify(req.body.token, config.jwt_secret, function (err, decoded) {
            if (err) {
                winston.error('/reset/password/:id error: ', err);
                return res.json({success: false, message: 'Token хугацаа дууссан байна'});
            } else {
                User.findOne({_id: decoded.id}, function (err, user) {
                    if (err) {
                        winston.error('/register email send error', err);
                        return res.json({success: false, message: 'Имэйл илгээхэд алдаа гарлаа'});
                    } else if (user && (user._id.toString() === req.params.id.toString())) {
                        if (req.body.newPassword === req.body.newPasswordRepeat) {
                            user.password = bcrypt.hashSync(req.body.newPassword);
                            user.save(function (err, data) {
                                if (err) {
                                    winston.error(err);
                                    return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
                                } else {
                                    return res.status(200).json({
                                        success: true,
                                        username: user.username || user.email,
                                        message: 'Амжилттай солигдлоо'
                                    });
                                }
                            });
                        } else {
                            return res.status(200).json({success: false, message: 'Шинэ нууц үг зөрж байна'});
                        }
                    } else {
                        return res.json({success: false, message: 'Таарах хэргэдэгч орлдсонгүй'});
                    }
                });
            }
        });
    });
};

function renderIndex(initialState) {
    let css = "/dist/front_css.min.css";
    if (env === "development") {
        css = "/dist/css/front_css.css";
    }
    const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <title>Vouchers.mn</title>
        <meta name="theme-color" content="#71C904" >
        <link href='/images/favicon1.png' rel='shortcut icon' />
        <link rel="preconnect" href="https://fonts.gstatic.com">
<link rel='stylesheet' id='roboto-css'  href='//fonts.googleapis.com/css2?family=Roboto%3Awght%40100%3B300%3B400%3B500%3B700&#038;display=swap&#038;ver=5.7.2' type='text/css' media='all' />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
          integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
          crossorigin="anonymous"
        />
<link rel='dns-prefetch' href='//cdn.materialdesignicons.com' />
        <link type="text/css" rel="stylesheet" href="/css/swiper.min.css" media="screen,projection"/>
        <link type="text/css" rel="stylesheet" href=${css} media="screen,projection"/>
        <script></script>
      </head>
      <body>
      
      <!-- Messenger Chat Plugin Code -->
    <div id="fb-root"></div>

    <!-- Your Chat Plugin code -->
    <div id="fb-customer-chat" class="fb-customerchat">
    </div>

    <script>
      var chatbox = document.getElementById('fb-customer-chat');
      chatbox.setAttribute("page_id", "100698432135111");
      chatbox.setAttribute("attribution", "biz_inbox");
      window.fbAsyncInit = function() {
        FB.init({
          xfbml            : true,
          version          : 'v10.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    </script>
        <div id="wrap" ></div>
        <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>  
        <script src="/dist/bundle.js"></script>
      </body>
    </html>
  `
    return html;
}
