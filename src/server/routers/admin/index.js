import express from "express";
import winston from "winston";
import User from "../../models/User";
import auth from "../../../auth";

const env = process.env.NODE_ENV;
import jwt from "jsonwebtoken";

import upload_routers from "./upload_routers";
import slider_routers from "./slider_routers";
import config_routers from "./config_routers";
import pages_routes from "./pages_routes";
import locations_routes from "./lcoation_routes";
import cates_routes from "./cates_routes";
import tutions_routes from "./tutions_routes";
import companues_routes from "./companues_routes";
import group_routes from "./group_routes";
import requests_routes from "./requests_routes";
import news_routes from "./news_routes";
import groupName_routers from "./groupName_routers";
import product_routers from "./product_routers";
import couponcode_routers from './cuponcode_routers'

module.exports = function (app) {
    app.use(["/dashboard/*", "/dashboard"], function (req, res, next) {
        let token =
            req.body.token ||
            req.query.token ||
            req.headers["token"] ||
            req.cookies.token;
        if (token) {
            jwt.verify(
                token,
                "KDrL5JEaHklA3e9TjJSNaZXQGapZTRZh",
                function (err, decoded) {
                    if (err) {
                        winston.error(err);
                        res.clearCookie("token");
                        return res.redirect("/");
                    } else {
                        User.findOne({ _id: decoded.id }, function (err, user) {
                            req.user = user;
                            next();
                        });
                    }
                }
            );
        } else {
            return res.redirect("/");
        }
    });

    const sliderRouter = express.Router();
    slider_routers(sliderRouter);
    app.use("/dashboard/api", sliderRouter);

    const uploadRouter = express.Router();
    upload_routers(uploadRouter);
    app.use("/dashboard/api", uploadRouter);

    const configRouter = express.Router();
    config_routers(configRouter);
    app.use("/dashboard/api", configRouter);

    const pagesRouter = express.Router();
    pages_routes(pagesRouter);
    app.use("/dashboard/api", pagesRouter);

    const cateRouter = express.Router();
    cates_routes(cateRouter);
    app.use("/dashboard/api", cateRouter);

    const locationRouter = express.Router();
    locations_routes(locationRouter);
    app.use("/dashboard/api", locationRouter);

    const tutionsRouter = express.Router();
    tutions_routes(tutionsRouter);
    app.use("/dashboard/api", tutionsRouter);

    const groupRouter = express.Router();
    group_routes(groupRouter);
    app.use("/dashboard/api", groupRouter);

    const requestsRouter = express.Router();
    requests_routes(requestsRouter);
    app.use("/dashboard/api", requestsRouter);

    const companuesRouter = express.Router();
    companues_routes(companuesRouter);
    app.use("/dashboard/api", companuesRouter);

    const newsRouter = express.Router();
    news_routes(newsRouter);
    app.use("/dashboard/api", newsRouter);

    const groupNameRouter = express.Router();
    groupName_routers(groupNameRouter);
    app.use("/dashboard/api", groupNameRouter);

    const productRouter = express.Router();
    product_routers(productRouter);
    app.use("/dashboard/api", productRouter);

    const couponRouter = express.Router()
    couponcode_routers(couponRouter)
    app.use("/dashboard/api", couponRouter)

    app.get(["/dashboard/*", "/dashboard"], auth.company, function (req, res) {
        const initialState = {
            main: {
                user: req.user,
            },
        };
        res.header("Content-Type", "text/html; charset=utf-8");
        res.status(200).end(renderIndex(initialState));
    });
};

function renderIndex(initialState) {
    let css = "/dist/admin_css.min.css";
    if (env === "development") {
        css = "/dist/css/admin_css.css";
    }
    const html = `
    <!doctype html>
    <!doctype html>
    <html lang="en">
      <head>
      <title>Vouchers.mn</title> 
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height">
        <link href='/images/faviconVoucher.png' rel='shortcut icon' />
        <link type="text/css" rel="stylesheet" href=${css} media="screen,projection"/>
        <script type="text/javascript" src="/js/tinymce/tinymce.min.js"></script> 
      </head>
      <script>
      window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
      </script>
      <body>
        <div id="social">            
        </div>
        <script src="/dist/admin.js"></script>
        
      </body>
    </html>
  `;
    return html;
}
