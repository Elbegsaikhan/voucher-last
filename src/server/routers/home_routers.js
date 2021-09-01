import winston from 'winston';
import async from 'async';
import Slider from "../models/Slider";
import Category from "../models/Category";
import User from "../models/User";
import Location from "../models/Location";
import nodemailer from "nodemailer";
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";

module.exports = function (router) {
    router.get('/home',function (req, res) {
        async.parallel([
            function(callback){
                Slider.find({status: 'active'}).sort({order : 1}).lean().exec(function(err,result){
                    callback(err,result);
                });
            },
            function(callback){
                Category.find({status: 'active'}).sort({order : 1}).lean().exec(function(err,result){
                    callback(err,result);
                });
            },
            function(callback){
                Location.find({status: 'active'}).sort({order : 1}).lean().exec(function(err,result){
                    callback(err,result);
                });
            },
            function(callback){
                User.find({status: 'active', role: 'company', membership: 'platinum'}).sort({created : 1}).limit(12).deepPopulate(['category', 'location']).lean().exec(function(err,result){
                    callback(err,result);
                });
            },
            function(callback){
                User.find({status: 'active', role: 'company', membership: 'gold'}).sort({created : 1}).limit(12).deepPopulate(['category', 'location']).lean().exec(function(err,result){
                    callback(err,result);
                });
            },
        ],function(err,results){

            if(err) {
                winston.error(err);
                return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
            } else {
                let parents = results[1].filter(item => item.parent == null || item.parent === '');
                let cates = parents.map(function (item) {
                    if(results[1].some(aa => ((aa.parent || {})._id || '').toString() === item._id.toString())) {
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
                    if(results[2].some(aa => ((aa.parent || {})._id || '').toString() === item._id.toString())) {
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
                    sliders: results[0] || [],
                    cates: cates || [],
                    locations: cates1 || [],
                    companyPlatinum: results[3] || [],
                    companyGold: results[4] || [],
                });
            }
        })
    });
};
