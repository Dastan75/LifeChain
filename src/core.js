import cliProgress from 'cli-progress'
import 'pretty-console-colors';
import dotenv from 'dotenv'
import http from 'http'
import os from 'os'


class Core {

    envManager = {}
    #envApp = {}

    constructor(envPath = process.cwd()) {
        console.info('Initiate Core...')
        this.envManager = dotenv
        this.init(envPath)
        console.info('Core loaded!')
    }


    init() {
        const result = this.envManager.config()
        this.#envApp = { ...process.env }
        if (result.error) {
            // console.error(result.error)
            console.error('Env loading failed!')
            return
            throw result.error
        }


        console.info('ENV loaded:', result.parsed)
    }

    getEnv(prop) {
        return prop ? this.#envApp[props] : this.#envApp
    }


    getPublicIp() {
        var options = {
            host: 'bot.whatismyipaddress.com',
            port: 80,
            path: '/'
        };

        http.get(options, function (res) {
            console.log("status: " + res.statusCode);

            res.on("data", function (chunk) {
                console.log("BODY: " + chunk);
            });
        }).on('error', function (e) {
            console.log("error: " + e.message);
        })
    }

    getPrivateIp() {
        var networkInterfaces = os.networkInterfaces();
        // console.log(networkInterfaces);

    }
}


// Show pretty console logs
// console.log('👋 Log: Hi from NodeJS');
// console.info('👋 Info: Hi from NodeJS');
// console.warn('👋 Warn: Hi from NodeJS');
// console.error('👋 Error: Hi from NodeJS');

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

export default Core


// start the progress bar with a total value of 200 and start value of 0
// Core.start(200, 0);

// update the current value in your application..
// Core.update(10);
// Core.update(50);
// Core.update(100);
// Core.update(150);


// stop the progress bar
// Core.stop();