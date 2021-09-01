import winston from 'winston';
import Page from "../models/Page";
import News from "../models/News";
module.exports = function (router) {
    router.get('/pageSingle/:slug',function (req, res) {
        Page.findOne({slug:req.params.slug,status: 'active'}).exec(function(err,page){
            if(err) {
                winston.error(err);
                return res.status(200).json({success: false,message: 'Системд алдаа гарлаа'});
            } else {
                if(page){
                    return res.json({success: true, page});
                } else {
                    return res.status(404).json({success: false});
                }
            }
        });
    });
    router.get('/newsSingle/:slug',function (req, res) {
        News.findOne({slug:req.params.slug,status: 'active'}).deepPopulate(['company']).exec(function(err,page){
            if(err) {
                winston.error(err);
                return res.status(200).json({success: false,message: 'Системд алдаа гарлаа'});
            } else {
                if(page){
                    return res.json({success: true, page});
                } else {
                    return res.status(404).json({success: false});
                }
            }
        });
    });
};