import Cupon from '../models/Cuponcode'
import winston from 'winston'

module.exports = function (router) {
	router.get('/delete/coupon/:code', function (req, res) {
		Cupon.findOne({code: req.params.code, status: 'active'}).exec(function (err, cp) {
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
						return res.json({success: true, sucmod: true, message: 'Таны оруулсан зөв байна', code: req.params.code});
					} else {
						return res.json({success: false, message: 'Системд алдаа гарлаа'});
					}
				});
			} else {
				return res.json({success: false, message: 'Таны оруулсан код буруу байна'});
			}
		});
	});
}
