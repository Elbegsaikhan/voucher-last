import auth from "../../../auth";

import Request from "../../models/Request";
import Product from "../../models/Product";
import winston from 'winston';
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";
import path from 'path';
import moment from 'moment';
import Jimp from "jimp";
import fs from "fs";
import slug from 'slug'
import async from "async";
// import Category from "../../models/Category";
// import Location from "../../models/Location";
module.exports = function (router) {

    router.get('/requests/:current', auth.company ,function (req,res) {
        let start = parseInt(req.params.current);
        console.log(start)
        if (isNaN(start)) {
            start = 0;
        }
        Product.find({status: 'active', company: req.user._id}).exec(function (err, products) {
            if(err) {
                winston.error(err);
                return res.status(200).json({success: false,message: 'Системд алдаа гарлаа'});
            } else {
                async.parallel([
                    function(callback){
                        Request.find({status: {$ne: 'delete'}, product: {$in: (products || []).map(aa => aa._id)}}).skip(start * 30).limit(30).deepPopulate(['user', 'tution']).exec(function(err,result){
                            callback(err,result);
                        });
                    },
                    function(callback){
                        Request.count({status: {$ne: 'delete'}, product: {$in: (products || []).map(aa => aa._id)}}).exec(function(err,result){
                            callback(err,result);
                        });
                    },
                ],function(err,results){
                    if(err) {
                        winston.error(err);
                        return res.status(200).json({success: false,message: 'Системд алдаа гарлаа'});
                    } else {
                        return res.json({success: true,items: results[0] || [], all: results[1]});
                    }
                })
            }
        })
    });
    router.get('/requestsChangeStats', auth.company ,function (req,res) {
        Request.findOne({_id: req.query.id}).exec(function (err, rqq) {
            if(err) {
                winston.error(err);
                return res.status(200).json({success: false,message: 'Системд алдаа гарлаа1'});
            } else if(rqq && (req.query.value === 'pending' || req.query.value === 'active')){
                rqq.status = req.query.value;
                rqq.save(function (err, ssss) {
                    if(err){
                        winston.error(err);
                        return res.json({success: false, message: 'Системд алдаа гарлаа2'});
                    } else {
                        Request.findOne({_id: ssss._id}).deepPopulate(['user', 'product']).exec(function (err, prodyc) {
                            if(err) {
                                winston.error(err);
                                return res.status(200).json({success: false,message: 'Системд алдаа гарлаа3'});
                            } else if(prodyc){
                                return res.json({success: true,item: prodyc});
                            } else {
                                return res.status(200).json({success: false,message: 'Системд алдаа гарлаа4'});
                            }
                        })
                    }
                });
            } else {
                return res.status(200).json({success: false,message: 'Системд алдаа гарлаа5'});
            }
        })
    });
};
