import auth from "../../../auth";

import Category from "../../models/Category";
import User from "../../models/User";
import winston from "winston";
import { check, validationResult } from "express-validator/check";
import { matchedData } from "express-validator/filter";
import path from "path";
import moment from "moment";
import Jimp from "jimp";
import fs from "fs";
import slug from "slug";
import async from "async";
module.exports = function (router) {
  router.get("/categories", auth.company || auth.admin, function (req, res) {
    async.parallel(
      [
        function (callback) {
          Category.find({ status: "active" })
            .sort({ order: 1 })
            .lean()
            .exec(function (err, result) {
              callback(err, result);
            });
        },
        function (callback) {
          Category.find({
            status: "active",
            $or: [{ parent: { $exists: false } }, { parent: null }],
          })
            .lean()
            .exec(function (err, result) {
              callback(err, result);
            });
        },
      ],
      function (err, results) {
        if (err) {
          winston.error("/admin/api/getCategory", err);
          return res
            .status(200)
            .json({ success: false, msg: "Системийн алдаа", err });
        }
        let parents = results[0].filter(
          (item) => item.parent == null || item.parent === ""
        );
        let cates = parents.map(function (item) {
          if (
            results[0].some(
              (aa) =>
                ((aa.parent || {})._id || "").toString() ===
                item._id.toString()
            )
          ) {
            return {
              ...item,
              child:
                results[0].filter(
                  (b) =>
                    (
                      (b.parent || {})._id || ""
                    ).toString() === item._id.toString()
                ) || [],
            };
          } else {
            return item;
          }
        });
        return res
          .status(200)
          .json({
            success: true,
            categories: cates || [],
            parentCates: results[1] || [],
          });
      }
    );
  });
  router.post(
    "/categories/action",
    auth.admin,
    [
      check("_id").trim(),
      check("parent"),
      check("title")
        .not()
        .isEmpty()
        .withMessage("Гарчиг оруулна уу")
        .trim(),
      check("order")
        .not()
        .isEmpty()
        .withMessage("Дараалал оруулна уу")
        .isNumeric()
        .withMessage("Дараалал тоо байх шаардлагатай")
        .trim(),
      check('image')
        .trim(),
    ],
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(200)
          .json({ success: false, message: errors.array()[0].msg });
      }
      let data = matchedData(req);
      function imageFc(callback) {
        if (req.body.newImage) {
          let input = path.resolve(__dirname, "../../../../static" + data.image);
          let out = path.resolve(__dirname, "../../../../static/uploads/" + moment().format('YYYY') + '/' + moment().format('MM'));
          fs.mkdir(out, function (e) {
            Jimp.read(input, function (err, image) {
              if (err) {
                winston.error('jump read error', err);
                res.json({ success: false, msg: "Зураг зөөхөд алдаа галаа дахин оруулна уу" })
              }
              if (image) {
                image.quality(70);
                let image_url = path.resolve(__dirname, "../../../../static/uploads/" + moment().format('YYYY') + '/' + moment().format('MM') + '/' + data.image.replace('/tmp/', ''));
                image.write(image_url, function (err) {
                  if (err) {
                    winston.error('upload write error', err);
                    res.json({ success: false, msg: "Зураг хадгалж чадсангүй" });
                  } else {
                    callback(`/uploads/${moment().format('YYYY')}/${moment().format('MM')}/${data.image.replace('/tmp/', '')}`);
                  }
                });
              } else {
                res.json({ success: false, message: "Зураг зөөхөд алдаа галаа дахин оруулна уу" })
              }
            });
          });
        } else {
          callback(data.image);
        }
      }
      if (req.body._id === 0) {
        imageFc(function (imagePath) {

          let sl = slug(data.title);
          let regex = new RegExp("^" + sl, "i");
          Category.find({ slug: regex }).exec((rr, cc) => {
            if (cc && cc.length > 0) {
              sl = `${sl}-${cc.length}`;
            }
            let cate = new Category();
            cate.title = data.title;
            cate.slug = sl;
            cate.order = data.order;
            cate.image = imagePath;
            if (data.parent) {
              cate.parent = data.parent;
            } else {
              cate.parent = null;
            }
            cate.save(function (err, data) {
              if (err) {
                winston.error(err);
                return res.json({
                  success: false,
                  message: "Системд алдаа гарлаа",
                });
              }
              if (data) {
                async.parallel(
                  [
                    function (callback) {
                      Category.find({ status: "active" })
                        .sort({ order: 1 })
                        .lean()
                        .exec(function (err, result) {
                          callback(err, result);
                        });
                    },
                    function (callback) {
                      Category.find({
                        status: "active",
                        $or: [
                          { parent: { $exists: false } },
                          { parent: null },
                        ],
                      })
                        .lean()
                        .exec(function (err, result) {
                          callback(err, result);
                        });
                    },
                  ],
                  function (err, results) {
                    if (err) {
                      winston.error(
                        "/admin/api/getCategory",
                        err
                      );
                      return res
                        .status(200)
                        .json({
                          success: false,
                          msg: "Системийн алдаа",
                          err,
                        });
                    }
                    let parents = results[0].filter(
                      (item) =>
                        item.parent == null ||
                        item.parent === ""
                    );
                    let cates = parents.map(function (item) {
                      if (
                        results[0].some(
                          (aa) =>
                            (
                              (aa.parent || {})._id ||
                              ""
                            ).toString() ===
                            item._id.toString()
                        )
                      ) {
                        return {
                          ...item,
                          child:
                            results[0].filter(
                              (b) =>
                                (
                                  (b.parent || {})
                                    ._id || ""
                                ).toString() ===
                                item._id.toString()
                            ) || [],
                        };
                      } else {
                        return item;
                      }
                    });
                    return res
                      .status(200)
                      .json({
                        success: true,
                        categories: cates || [],
                        parentCates: results[1] || [],
                      });
                  }
                );
              } else {
                return res.json({
                  success: false,
                  message: "Системд алдаа гарлаа",
                });
              }
            });
          });
        })
      } else {
        imageFc(function (imagePath) {

          Category.findOne({ _id: req.body._id, status: "active" }).exec(
            function (err, cate) {
              if (err) {
                winston.error(err);
                return res
                  .status(200)
                  .json({
                    success: false,
                    message: "Системд алдаа гарлаа",
                  });
              }
              if (cate) {
                cate.title = data.title;
                cate.order = data.order;
                cate.image = imagePath;
                if (data.parent) {
                  cate.parent = data.parent;
                } else {
                  cate.parent = null;
                }
                cate.save(function (err, data) {
                  if (err) {
                    winston.error(err);
                    return res.json({
                      success: false,
                      message: "Системд алдаа гарлаа",
                    });
                  }
                  if (data) {
                    async.parallel(
                      [
                        function (callback) {
                          Category.find({
                            status: "active",
                          })
                            .sort({ order: 1 })
                            .lean()
                            .exec(function (
                              err,
                              result
                            ) {
                              callback(err, result);
                            });
                        },
                        function (callback) {
                          Category.find({
                            status: "active",
                            $or: [
                              {
                                parent: {
                                  $exists: false,
                                },
                              },
                              { parent: null },
                            ],
                          })
                            .lean()
                            .exec(function (
                              err,
                              result
                            ) {
                              callback(err, result);
                            });
                        },
                      ],
                      function (err, results) {
                        if (err) {
                          winston.error(
                            "/admin/api/getCategory",
                            err
                          );
                          return res
                            .status(200)
                            .json({
                              success: false,
                              msg: "Системийн алдаа",
                              err,
                            });
                        }
                        let parents = results[0].filter(
                          (item) =>
                            item.parent == null ||
                            item.parent === ""
                        );
                        let cates = parents.map(function (
                          item
                        ) {
                          if (
                            results[0].some(
                              (aa) =>
                                (
                                  (
                                    aa.parent ||
                                    {}
                                  )._id || ""
                                ).toString() ===
                                item._id.toString()
                            )
                          ) {
                            return {
                              ...item,
                              child:
                                results[0].filter(
                                  (b) =>
                                    (
                                      (
                                        b.parent ||
                                        {}
                                      )._id ||
                                      ""
                                    ).toString() ===
                                    item._id.toString()
                                ) || [],
                            };
                          } else {
                            return item;
                          }
                        });
                        return res
                          .status(200)
                          .json({
                            success: true,
                            categories: cates || [],
                            parentCates:
                              results[1] || [],
                          });
                      }
                    );
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
                  message: "Category олдсонгүй",
                });
              }
            }
          );
        })
      }
    }
  );
  router.get("/get/category/:id", auth.admin, function (req, res) {
    Category.findOne({ _id: req.params.id, status: "active" }).exec(
      function (err, result) {
        if (err) {
          winston.error(err);
          return res
            .status(200)
            .json({
              success: false,
              message: "Системд алдаа гарлаа",
            });
        }
        if (result) {
          return res.json({ success: true, result: result });
        } else {
          return res.json({ success: false, message: "Олдсонгүй" });
        }
      }
    );
  });
  router.get("/delete/category/:id", auth.admin, function (req, res) {
    User.find({ category: req.params.id, status: "active" }).exec(
      (err, user) => {
        if (err) {
          winston.error("/delete/category/:id", err);
          return res
            .status(200)
            .json({
              success: false,
              message: "Системд алдаа гарлаа",
            });
        } else {
          if (user.length == 0) {
            Category.findOne({
              _id: req.params.id,
              status: "active",
            }).exec(function (err, cate) {
              if (err) {
                winston.error(err);
                return res
                  .status(200)
                  .json({
                    success: false,
                    message: "Системд алдаа гарлаа",
                  });
              }
              if (cate) {
                cate.status = "delete";
                cate.save(function (err, data) {
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
                  message: "Category олдсонгүй",
                });
              }
            });
          } else {
            return res.json({
              success: false,
              message: "Category харьяалагдсан мэдээ байна!",
            });
          }
        }
      }
    );
  });
};
