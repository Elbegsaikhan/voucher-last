import Cart from "../models/Cart.js";
import winston from "winston";
import auth from "../../auth";
import {check, validationResult} from "express-validator/check";
import {matchedData} from "express-validator/filter";
import async from 'async';


module.exports = (router) => {
	router.get("/cart", function (req, res) {
		async.parallel(
			[
				function (callback) {
					Cart.find({status: "active"}).exec(function (err, result) {
							callback(err, result);
						});
				},
				function (callback) {
					Cart.count({status: "active", type: 1}, function (err, result) {
						callback(err, result);
					});
				},
			],
			function (err, results) {
				if (err) {
					winston.error(err);
					return res
						.status(200)
						.json({
							success: false,
							message: "Cart router dr aldaa",
						});
				} else {
					return res.json({
						success: true,
						result: results[0] || [],
						all: results[1],
					});
				}
			}
		);

	});

	router.post(
		"/save/cart",
		[
			check("_id").trim(),
			check("user").trim(),
			check("product").trim(),
			check('type').trim(),
		],
		function (req, res) {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res
					.status(200)
					.json({
						success: false,
						message: `Aldaa ${errors.array()[0].msg}`,
					});
			}
			let data = matchedData(req);
			console.log("Data ", data);

			if (req.body._id === 0) {
				Cart.findOne({user: data.user, product: data.product, status: "active"}).exec(
					function (err, cart) {
						if (err) {
							winston.error(err);
							return res
								.status(200)
								.json({
									success: false,
									message: "Системд алдаа гарлаа",
								});
						}
						if (cart) {
							cart.user = data.user;
							cart.product = data.product;
							cart.type = data.type;
							cart.save(function (err, data) {
								if (err) {
									winston.error(err);
									return res.json({
										success: false,
										message: "Системд алдаа гарлаа",
									});
								}
								if (data) {
									return res.json({
										success: true,
										sucmod: true,
										message: "Сагсанд амжилттай нэмлээ",
										result: data,
										edit: true,
									});
								} else {
									return res.json({
										success: false,
										message: "Системд алдаа гарлаа",
									});
								}
							});
						} else {
							console.log("else")
							let cart1 = new Cart();
							cart1.user = data.user;
							cart1.product = data.product;
							cart1.type = data.type;
							cart1.save(function (err, data) {
								if (err) {
									winston.error(err);
									return res.json({
										success: false,
										message: "Системд алдаа гарлаа",
									});
								}
								if (data) {
									return res.json({
										success: true,
										sucmod: true,
										// message: "Амжилттай хадгалагдлаа",
										result: data,
										edit: false,
									});
								} else {
									return res.json({
										success: false,
										message: "Системд алдаа гарлаа",
									});
								}
							});
						}
					}
				);

			} else {
				Cart.findOne({_id: req.body._id, status: "active"}).exec(
					function (err, cart) {
						if (err) {
							winston.error(err);
							return res
								.status(200)
								.json({
									success: false,
									message: "Системд алдаа гарлаа",
								});
						}
						if (cart) {
							cart.user = data.user;
							cart.product = data.product;
							cart.type = data.type;
							cart.save(function (err, data) {
								if (err) {
									winston.error(err);
									return res.json({
										success: false,
										message: "Системд алдаа гарлаа",
									});
								}
								if (data) {
									return res.json({
										success: true,
										sucmod: true,
										message: "Сагсанд амжилттай нэмлээ",
										result: data,
										edit: true,
									});
								} else {
									return res.json({
										success: false,
										message: "Системд алдаа гарлаа",
									});
								}
							});
						} else {
							return res.json({
								success: false,
								message: "Cart олдсонгүй",
							});
						}
					}
				);
			}
		}
	);
	router.get("/delete/cart/:id", auth.company, function (req, res) {
		Cart.findOne({_id: req.params.id, status: "active"}).exec(function (
			err,
			cart
		) {
			if (err) {
				winston.error(err);
				return res
					.status(200)
					.json({success: false, message: "Системд алдаа гарлаа"});
			}
			if (cart) {
				cart.status = "delete";
				cart.save(function (err, data) {
					if (err) {
						winston.error(err);
						return res.json({
							success: false,
							message: "Системд алдаа гарлаа",
						});
					}
					if (data) {
						return res.json({
							success: true,
							sucmod: true,
							message: "Амжилттай услтгагдлаа",
							id: req.params.id,
						});
					} else {
						return res.json({
							success: false,
							message: "Системд алдаа гарлаа",
						});
					}
				});
			} else {
				return res.json({
					success: false,
					message: "product олдсонгүй",
				});
			}
		});
	});

	// router.post("/cart", (req, res) => {
	//     const body = req.body;
	//     console.log("Product", req.body);
	//     const cart = new Cart(body);
	//
	//     res.send(body);
	//     try {
	//         cart.save();
	//         res.status(200).json({ success: "SAve" });
	//     } catch (error) {
	//         res.status(409).json({ error: error.message });
	//     }
	// });
};
