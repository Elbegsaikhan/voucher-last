import winston from 'winston';
import auth from "../../../auth";
import multer from 'multer';
import path from 'path';
import moment from "moment";
import Jimp from "jimp";
import fs from "fs";

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname,"../../../../static/tmp/"))
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime()+ path.extname(file.originalname));
    }
});

let uploading = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        var type = '|' + path.extname(file.originalname) + '|';
        var fileTypeValid = '|.jpg|.png|.jpeg|.gif|.JPG|.PNG|.JPEG|.GIF|'.indexOf(type) !== -1;
        cb(null, fileTypeValid);
    },
    limits: {fileSize: 5242880, files:1},
});
let image = uploading.single('image');

module.exports = function (router) {
    router.post('/upload', auth.company || auth.admin ,function (req, res) {
        image(req, res, function (error) {
            if(error){
                winston.error(error);
                return res.json({success:false});
            }
            if(req.file){
                return res.json({success:true, result:`/tmp/${req.file.filename}`});
            }else{
                return res.json({success:false});
            }
        })
    });
    router.post('/upload/direct', auth.company ,function (req, res) {
        image(req, res, function (error) {
            if(error){
                winston.error(error);
                return res.json({success:false});
            }
            if(req.file){
                let input = path.resolve(__dirname,"../../../../static/tmp/"+req.file.filename);
                let out = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM'));
                fs.mkdir(out,function(e){
                    Jimp.read(input, function (err, image) {
                        if(err){
                            winston.error('jump read error',err);
                            res.json({success: false, msg: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                        if(image){
                            image.quality(70);
                            let image_url = path.resolve(__dirname,"../../../../static/uploads/"+moment().format('YYYY')+'/'+moment().format('MM')+'/'+req.file.filename);
                            image.write(image_url,function(err){
                                if(err){
                                    winston.error('upload write error',err);
                                    res.json({success: false, msg: "Зураг хадгалж чадсангүй"});
                                }else{
                                    return res.json({success:true, result:`/uploads/${moment().format('YYYY')}/${moment().format('MM')}/${req.file.filename}`});
                                }
                            });
                        }else{
                            res.json({success: false, message: "Зураг зөөхөд алдаа галаа дахин оруулна уу"})
                        }
                    });
                });
            }else{
                return res.json({success:false});
            }
        })
    });
};
