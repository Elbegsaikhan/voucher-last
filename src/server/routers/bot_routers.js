import winston from 'winston';
import async from 'async';
import Slider from "../models/Slider";
import Config from "../models/Config";
import striptags from "striptags";


module.exports = function (router) {
    router.get('/',function (req, res, next) {
        if(req.useragent.isBot) {
            async.parallel([
                function(callback){
                    Slider.find({status: 'active'}).sort({order : 1}).limit(5).exec(function(err,result){
                        callback(err,result);
                    });
                },
                function(callback){
                    Config.findOne({status: 'active'}).exec(function(err,result){
                        callback(err,result);
                    });
                },
            ],function(err,results){
                if(err) {
                    winston.error(err);
                    return res.status(404).render('404', {bot: req.config || {}});
                } else {
                    return res.status(200).render('home',{
                        success: true,
                        sliders: results[0] || [],
                        config: results[1] || {},
                        bot: req.config || {}
                    });
                }
            })
        } else {
            next();
        }
    });
    router.get('*',function (req,res,next) {
        if(req.useragent.isBot) {
            return res.status(404).render('404', {bot: req.config || {}});
        }else{
            next();
        }
    });
};