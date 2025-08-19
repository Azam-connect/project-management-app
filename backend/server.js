const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet")
const { log } = require("./utils/debugger");
const bodyParser = require("body-parser");
// const router = require("./routes");


const app = express();
const httpServer = require('http').createServer(app);

app.use(helmet());
app.use(cors());
app.disable('x-powered-by');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
const allowedOrigins = [];

const origins = allowedOrigins.length === 0 ? '*' : allowedOrigins;

app.use(
    cors({
        origin: origins,
        methods: 'GET,PUT,POST,DELETE',
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    })
);

app.use((req, res, next) => {
    res.removeHeader('access-control-allow-headers');
    res.removeHeader('access-control-allow-methods');
    res.removeHeader('content-length');
    res.removeHeader('content-type');
    res.removeHeader('date');
    res.removeHeader('etag');
    res.removeHeader('x-powered-by');
    next();
});
// app.use("/api", router);

app.get('/', async (req, res) => {
    return res.status(200).json({ message: 'Welcome to Project Management App API' });
});

httpServer.listen(process.env.PORT, () => {
    log(`Server is running at Port : ${process.env.PORT}`);
});
