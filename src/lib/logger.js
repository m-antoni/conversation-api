const listEndpoints = require('express-list-endpoints');
const CLITable = require('cli-table3');
const fs = require('fs');

const appLogger = () => {
    const { APP_NAME, PORT, DB_PORT, DB_DATABASE, APP_TARGET, NODE_ENV } =
        process.env;

    const appPORT = PORT || 8080;
    const appTARGET = APP_TARGET || `http://localhost:8080`;

    let appObj = {
        APP_NAME,
        DATABASE: DB_DATABASE,
        DB_PORT,
        APP_TARGET: appTARGET,
        PORT: appPORT,
        NODE_ENV,
    };

    // Table Instance
    let table = new CLITable({
        chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
        // head: ['#'.cyan, 'METHOD'.cyan, 'URI'.cyan, 'MIDDLEWARES'.cyan],
        // style: { 'padding-left': 1, 'padding-right': 1 }, // Styles here
        colWidths: [15, 35],
    });

    for (const key in appObj) {
        // console.log(`${key}: ${appObj[key]}`)
        table.push([`${key}`.yellow, `${appObj[key]}`]);
    }

    let table_route_list = table.toString();

    console.log(table_route_list);
};

const createTableRoutes = (app) => {
    let list = listEndpoints(app);

    // Table Instance
    let table = new CLITable({
        // chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
        style: { 'padding-left': 1, 'padding-right': 1 }, // Styles here
        // head: ['#'.cyan, 'METHOD'.cyan, 'URI'.cyan, 'MIDDLEWARES'.cyan],
        head: ['#'.cyan, 'METHOD'.cyan, 'URI'.cyan],
        colWidths: [5, 15, 40],
    });

    // Loop through the api routes
    list.map((list, i) => {
        let num = `${i + 1}`;
        table.push([num, list.methods.toString(), list.path]);
    });

    let table_route_list = table.toString();

    // Write into a file
    fs.writeFileSync('./src/logs/route-logs.txt', table_route_list);
};

const viewRoutesToCLI = () => {
    // THIS WILL READ THE TXT FILE AND LOG IT TO THE CLI
    const data = fs.readFileSync('./src/logs/route-logs.txt', 'utf8');
    console.log(data);
};

module.exports = {
    appLogger,
    createTableRoutes,
    viewRoutesToCLI,
};
