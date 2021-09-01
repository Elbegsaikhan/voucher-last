import auth from '../../../auth'
import Cupon from '../../models/Cuponcode'
import winston from 'winston'
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";
import async from "async";

module.exports = function (router) {
	router.get("/coupon/:current", auth.company , function (req, res) {
		let start = parseInt(req.params.current);
		if (isNaN(start)) {
			start = 0;
		}
		async.parallel(
			[
				function (callback) {
					Cupon.find({status: 'active'}).sort({order : 1}).skip(start * 30).limit(30).exec(function(err,result){
						callback(err,result);
					});
				},
				function (callback) {
					Cupon.count({
						status: "active",
					}).exec(function (err, result) {
						callback(err, result);
					});
				},
			],
			function (err, results) {
				if (err) {
					winston.error("/admin/api/getCupon", err);
					return res
						.status(200)
						.json({success: false, msg: "Системийн алдаа", err});
				}
				return res
					.status(200)
					.json({
						success: true,
						result: results[0],
						all: results[1]
					});
			}
		);
	})
	router.post('/save/coupon', auth.company, [
		check('_id').trim(), check('code').isNumeric().trim(), check("user").trim()
	], function (req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(200).json({success: false, message: `Aldaa${errors.array()[0].msg}`})
		}
		let data = matchedData(req)
		console.log(data)
		if (req.body._id === 0) {
			let cup = new Cupon();
			cup.code = data.code
			cup.user = data.user
			cup.save(function (err, data) {
				if (err) {
					winston.error(err)
					return res.json({success: false, message: 'Системд алдаа гарлаа'})
				}
				if (data) {
					return res.json({success: true, sucmod: true, message: 'Амжилттай купон нэмлээ'})
				} else {
					return res.json({success: false, message: 'Системд алдаа гарлаа'})
				}
			})
		} else {
			Cupon.findOne({_id: req.body._id, status: 'active'}).exec(function (err, result) {
				if (err) {
					winston.error(err)
					return res.status(200).json({success: false, message: 'Системд хадгалагдлаа'})
				}
				if (result) {
					result.code = data.code
					result.user = data.user
					result.save(function (err, data) {
						if (err) {
							winston.error(err)
							return res.json({success: false, message: 'Системд алдаа гарлаа'})
						}
						if (data) {
							return res.json({success: false, sucmod: true, message: 'Амжилттай ', result: data, edit: true})
						} else {
							return res.json({success: false, message: 'Системд алдаа гарлаа'})
						}
					})
				} else {
					return res.json({success: false, message: 'Купон код орлоо'})
				}
			})
		}
	})
	router.get('/delete/coupon/:id', function (req, res) {
		Cupon.findOne({_id: req.params.id, status: 'active'}).exec(function (err, cp) {
			if (err) {
				winston.error(err);
				return res.status(200).json({success: false, message: 'Системд алдаа гарлаа'});
			}
			if (cp) {
				cp.status = 'delete';
				cp.save(function (err, data) {
					if (err) {
						winston.error(err);
						return res.json({success: false, message: 'Системд алдаа гарлаа'});
					}
					if (data) {
						return res.json({success: true, sucmod: true, message: 'Амжилттай услтгагдлаа', id: req.params.id});
					} else {
						return res.json({success: false, message: 'Системд алдаа гарлаа'});
					}
				});
			} else {
				return res.json({success: false, message: 'product олдсонгүй'});
			}
		});
	});
}
