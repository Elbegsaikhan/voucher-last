import path from "path";
import mongoose from 'mongoose';
import winston from 'winston';
const env = process.env.NODE_ENV;
import webpack from 'webpack';
import webpackConfig from '../../webpack.config.dev';
import useragent from "express-useragent";
import cookieParser from "cookie-parser";
import bodyparser from "body-parser";
import express from "express";
import session from "express-session";
import webpack_dev_middleware from "webpack-dev-middleware";
import webpack_hot_middleware from "webpack-hot-middleware";

const app = express();
const logPath = path.resolve(__dirname, "../../logs");
if (env === "development") {
    let adminReactCompiler = webpack(webpackConfig);

    app.use(webpack_dev_middleware(adminReactCompiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    }));

    app.use(webpack_hot_middleware(adminReactCompiler));
}


var configServer = {
    mongoUrl: 'mongodb://103.143.40.220:27017/voucher',
    option: {
        "auth": { "authSource": "admin" },
        "user": "amjilt",
        "pass": "shijircom",
        "useMongoClient": true
    },
    logPath: path.resolve(__dirname, "logs")
};
// const config = {
//     mongoUrl:'mongodb://localhost/ipex',
//     logPath:path.resolve(__dirname, "../../logs")
// };
app.use(useragent.express());
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.set('view engine', 'pug');
app.set('views', path.resolve(__dirname, '../views'));
winston.add(winston.transports.File, { filename: logPath + '/error.log', name: 'error-file', level: 'error' });
app.use('/', express.static(path.join(__dirname, '../../static')));

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'surgaltuud'
}));

const adminRouter = express.Router();
require('./routers/admin')(adminRouter);
app.use(adminRouter);

const webRouter = express.Router();
require('./routers')(webRouter);
app.use(webRouter);


if (env === 'development') {
    mongoose.connect("mongodb://localhost:27017/vouchers");
    // mongoose.connect("mongodb+srv://mern:admin1234@cluster0.mqtoc.mongodb.net/vouchers?retryWrites=true&w=majority",
    //     {"useNewUrlParser": true, "useUnifiedTopology": true})

} else {
    // mongoose.connect(configServer.mongoUrl, configServer.option);
    mongoose.connect("mongodb://localhost:27017/vouchers");
}
// mongoose.connect(config.mongoUrl);
mongoose.connection.on('open', function (ref) {
    winston.info('db connected');
    app.listen(process.env.PORT || '8824', function (err) {
        if (err) {
            winston.error('app start error');
            winston.error(err);
            process.exit(1)
        } else {
            winston.info('app started port: %s', '8824')
        }
    });
});
mongoose.connection.on('error', function (error) {
    winston.error(error);
});
