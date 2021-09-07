import express from "express";
import React from "react";
const env = process.env.NODE_ENV;
import Config from "../models/Config";
import User from "../models/User";
import psl from "psl";
import winston from "winston";
import config from "../../config";
import jwt from "jsonwebtoken";

import home_routers from "./home_routers";
import auth_routers from "./auth_routers";
import media_routers from "./media_routers";
import pages_routers from "./pages_routers";
import profile_routers from "./profile_routers";
import cates_routers from "./cates_routers";
import product_routers from "./product_routers";
import cart_routers from "./cart_routers";
import withdraw_routers from './withdraw_routers'
import coupon_routers from './coupon_routers'

module.exports = function (app) {
    app.use("/*", function (req, res, next) {
        let protocol = env === "development" ? "http" : "https";
        let hostname = req.hostname;
        let parsed = psl.parse(hostname);
        req.domain = parsed.domain || "vouchers.mn";
        req.proto = protocol || "https";
        let token =
            req.body.token ||
            req.query.token ||
            req.headers["token"] ||
            req.cookies.token;
        if (token) {
            jwt.verify(token, config.jwt_secret, function (err, decoded) {
                if (err) {
                    winston.error(err);
                    req.session.destroy();
                    res.clearCookie("token", {domain: `.${req.domain}`});
                    next();
                } else {
                    User.findOne({_id: decoded.id})
                        .lean()
                        .exec(function (err, user) {
                            req.user = user;
                            next();
                        });
                }
            });
        } else {
            next();
        }
    });

    app.use("/*", function (req, res, next) {
        Config.findOne({status: "active"}).exec(function (err, result) {
            req.config = result;
            next();
        });
    });

    // const botRouter = express.Router();
    // bot_routers(botRouter);
    // app.use(botRouter);

    const homeRouter = express.Router();
    home_routers(homeRouter);
    app.use("/api", homeRouter);

    const authRouter = express.Router();
    auth_routers(authRouter);
    app.use("/api", authRouter);

    const pageRouter = express.Router();
    pages_routers(pageRouter);
    app.use("/api", pageRouter);

    const mediaRouter = express.Router();
    media_routers(mediaRouter);
    app.use("/api", mediaRouter);

    const catesRouter = express.Router();
    cates_routers(catesRouter);
    app.use("/api", catesRouter);

    const profileRouter = express.Router();
    profile_routers(profileRouter);
    app.use("/api", profileRouter);

    const productRouter = express.Router();
    product_routers(productRouter);
    app.use("/api", productRouter);

    const cartRouter = express.Router();
    cart_routers(cartRouter);
    app.use("/api", cartRouter);

    const withdrawRouter = express.Router();
    withdraw_routers(withdrawRouter);
    app.use("/checkout", withdrawRouter);

    const couponRouter = express.Router()
    coupon_routers(couponRouter)
    app.use('/api', couponRouter)

    app.get(["/*", "/"], async (req, res) => {
        const initialState = {
            main: {
                user: req.user || null,
                services: req.services || null,
                servicesCategories: req.servicesCategories || null,
                config: req.config || null,
            },
        };
        res.header("Content-Type", "text/html; charset=utf-8");
        res.status(200).end(renderIndex(initialState));
    });
};

function renderIndex(initialState) {
    let css = "/dist/front_css.min.css";
    if (env === "development") {
        css = "/dist/css/front_css.css";
    }
    const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <title>Vouchers.mn</title>
        <meta name="theme-color" content="#00FFEF" >
        <link href='/images/faviconVoucher.png' rel='shortcut icon' />
        <link rel="preconnect" href="https://fonts.gstatic.com">
<!--        <link rel='stylesheet' id='roboto-css'  href='//fonts.googleapis.com/css2?family=Roboto%3Awght%40100%3B300%3B400%3B500%3B700&#038;display=swap&#038;ver=5.7.2' type='text/css' media='all' />-->
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
       <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
          integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
          crossorigin="anonymous"
        />
        <link rel='dns-prefetch' href='//cdn.materialdesignicons.com' />
        <link type="text/css" rel="stylesheet" href="/css/swiper.min.css" media="screen,projection"/>
        <link type="text/css" rel="stylesheet" href=${css} media="screen,projection"/>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Lobster&display=swap" rel="stylesheet">
        
        <script></script>
      </head>
      <body>
      
      <!-- Messenger Chat Plugin Code -->
    <div id="fb-root"></div>

    <!-- Your Chat Plugin code -->
    <div id="fb-customer-chat" class="fb-customerchat">
    </div>

    <script>
      var chatbox = document.getElementById('fb-customer-chat');
      chatbox.setAttribute("page_id", "100698432135111");
      chatbox.setAttribute("attribution", "biz_inbox");
      window.fbAsyncInit = function() {
        FB.init({
          xfbml            : true,
          version          : 'v10.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    </script>
        <div id="wrap" ></div>
        <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>  
        <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
        <script src="/dist/bundle.js"></script>
      </body>
    </html>
  `;
    return html;
}
