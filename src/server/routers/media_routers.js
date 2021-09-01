import winston from 'winston';
import Jimp from "jimp";
import path from "path";
import fs from "fs";
import multer from "multer";
import moment from 'moment';
import Thumbler from "thumbler";
import mongoose from "mongoose";

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname,"../../../static/tmp"))
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + '-' + Math.ceil(Math.random() * 10) + path.extname(file.originalname));
    }
});
let uploading = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        let type = '|' + path.extname(file.originalname) + '|';
        let fileTypeValid = '|.jpg|.png|.jpeg|.JPG|.PNG|.JPEG|'.indexOf(type) !== -1;
        cb(null, fileTypeValid);
    },
    limits: {fileSize: 15242880, files:1},
});

let image = uploading.single('image');

module.exports = function (router) {
    router.post('/image/upload',function (req, res) {
        image(req, res, function (err) {
            if (err) {
                winston.error('/lesson/image/upload error', err);
                if (err.code == 'LIMIT_FILE_SIZE') {
                    return res.json({
                        success: false,
                        message: 'image_size'
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'Системийн алдаа',
                        error: err
                    });
                }
            }
            if (req.file) {
                let dir = moment().format('YYYY-MM-DD');
                let aa = path.resolve(__dirname, "../../../static/uploads/" + dir);
                fs.mkdir(aa, function (e) {
                    if (!e || (e && e.code === 'EEXIST')) {
                        let input = req.file.path;
                        let out = aa + '/' + req.file.filename;
                        Jimp.read(input, function (err, image) {
                            if (err) {
                                winston.error('/lesson/image/upload error', err);
                                return res.json({
                                    success: false,
                                    message: 'image_error'
                                })
                            }
                            let width = image.bitmap.width;
                            let height = image.bitmap.height;
                            if(width >= 1100 && height >= 400){
                                if(width/(height/400) >= 1100){
                                    let newWidth = (width/(height/400));
                                    let x = (newWidth-1100)/2;
                                    image.resize(Jimp.AUTO,400)
                                        .crop(x,0,1100,400)
                                        .quality(70);
                                }else{
                                    let newHeight = (height/(width/1100));
                                    let y = (newHeight-400)/2;
                                    image.resize(1100,Jimp.AUTO)
                                        .crop(0,y,1100,400)
                                        .quality(70);
                                }
                                image.write(out, function (er, img) {
                                    if (er) {
                                        winston.error('/lesson/image/upload error', er);
                                        return res.json({success: false, message: 'Зураг хадгалалт амжилтгүй'})
                                    } else {
                                        let path = '/uploads/' + dir + '/' + req.file.filename;
                                        return res.json({success: true, sucmod:true, image: path ,message: 'Зураг амжилттай хуулагдлаа'});
                                    }
                                });
                            } else {
                                return res.json({success: false, message: 'Зурагны хэмжээ багадаа 400/↑/ x 1100/→/ байх ёстой.'})
                            }
                        });
                    } else {
                        return res.json({success: false, message: 'Системийн алдаа'})
                    }
                });
            } else {
                return res.json({success: false, message: 'Системийн алдаа'})
            }
        });
    });
    router.post('/image/upload/news',function (req, res) {
        image(req, res, function (err) {
            if (err) {
                winston.error('/lesson/image/upload error', err);
                if (err.code == 'LIMIT_FILE_SIZE') {
                    return res.json({
                        success: false,
                        message: 'image_size'
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'Системийн алдаа',
                        error: err
                    });
                }
            }
            if (req.file) {
                let dir = moment().format('YYYY-MM-DD');
                let aa = path.resolve(__dirname, "../../../static/uploads/" + dir);
                fs.mkdir(aa, function (e) {
                    if (!e || (e && e.code === 'EEXIST')) {
                        let input = req.file.path;
                        let out = aa + '/' + req.file.filename;
                        Jimp.read(input, function (err, image) {
                            if (err) {
                                winston.error('/lesson/image/upload error', err);
                                return res.json({
                                    success: false,
                                    message: 'image_error'
                                })
                            }
                            let width = image.bitmap.width;
                            let height = image.bitmap.height;
                            if(width >= 500 && height >= 250){
                                if(width/(height/250) >= 500){
                                    let newWidth = (width/(height/250));
                                    let x = (newWidth-500)/2;
                                    image.resize(Jimp.AUTO,250)
                                        .crop(x,0,500,250)
                                        .quality(70);
                                }else{
                                    let newHeight = (height/(width/500));
                                    let y = (newHeight-250)/2;
                                    image.resize(500,Jimp.AUTO)
                                        .crop(0,y,500,250)
                                        .quality(70);
                                }
                                image.write(out, function (er, img) {
                                    if (er) {
                                        winston.error('/lesson/image/upload error', er);
                                        return res.json({success: false, message: 'Зураг хадгалалт амжилтгүй'})
                                    } else {
                                        let path = '/uploads/' + dir + '/' + req.file.filename;
                                        return res.json({success: true, sucmod:true, image: path ,message: 'Зураг амжилттай хуулагдлаа'});
                                    }
                                });
                            } else {
                                return res.json({success: false, message: 'Зурагны хэмжээ багадаа 250/↑/ x 500/→/ байх ёстой.'})
                            }
                        });
                    } else {
                        return res.json({success: false, message: 'Системийн алдаа'})
                    }
                });
            } else {
                return res.json({success: false, message: 'Системийн алдаа'})
            }
        });
    });
    router.post('/image/upload/logo',function (req, res) {
        image(req, res, function (err) {
            if (err) {
                winston.error('/lesson/image/upload error', err);
                if (err.code == 'LIMIT_FILE_SIZE') {
                    return res.json({
                        success: false,
                        message: 'image_size'
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'Системийн алдаа',
                        error: err
                    });
                }
            }
            if (req.file) {
                let dir = moment().format('YYYY-MM-DD');
                let aa = path.resolve(__dirname, "../../../static/uploads/" + dir);
                fs.mkdir(aa, function (e) {
                    if (!e || (e && e.code === 'EEXIST')) {
                        let input = req.file.path;
                        let out = aa + '/' + req.file.filename;
                        Jimp.read(input, function (err, image) {
                            if (err) {
                                winston.error('/lesson/image/upload error', err);
                                return res.json({
                                    success: false,
                                    message: 'image_error'
                                })
                            }
                            let width = image.bitmap.width;
                            let height = image.bitmap.height;
                            if(width > 400 && height > 400){
                                if(width/(height/400) >= 400){
                                    let newWidth = (width/(height/400));
                                    let x = (newWidth-400)/2;
                                    image.resize(Jimp.AUTO,400)
                                        .crop(x,0,400,400)
                                        .quality(70);
                                }else{
                                    let newHeight = (height/(width/400));
                                    let y = (newHeight-400)/2;
                                    image.resize(400,Jimp.AUTO)
                                        .crop(0,y,400,400)
                                        .quality(70);
                                }
                                image.write(out, function (er, img) {
                                    if (er) {
                                        winston.error('/lesson/image/upload error', er);
                                        return res.json({success: false, message: 'Зураг хадгалалт амжилтгүй'})
                                    } else {
                                        let path = '/uploads/' + dir + '/' + req.file.filename;
                                        return res.json({success: true, sucmod:true, image: path ,message: 'Зураг амжилттай хуулагдлаа'});
                                    }
                                });
                            } else {
                                return res.json({success: false, message: 'Зурагны хэмжээ багадаа 400/↑/ x 400/→/ байх ёстой.'})
                            }
                        });
                    } else {
                        return res.json({success: false, message: 'Системийн алдаа'})
                    }
                });
            } else {
                return res.json({success: false, message: 'Системийн алдаа'})
            }
        });
    });
};
