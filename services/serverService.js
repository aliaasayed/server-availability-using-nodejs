const servers = require('../serverData');
const fetch = require('node-fetch');

module.exports = {
    findServer: () => {
        return new Promise(function (resolve, reject) {
            Promise.all(servers.map(server =>
                //send get request to url
                fetch(server.url)
                    //check response status
                    .then(checkStatus)
            )).then(onlineServers => {
                //if no online servers
                if (onlineServers.length == 0)
                    reject("No Online Servers");
                else {
                    var priority = servers[0].priority;
                    var lowestServerUrl = servers[0].url;

                    //find lowest priority server
                    for (var i in onlineServers)
                        for (var j in servers)
                            if (onlineServers[i].url == servers[j].url.toLowerCase())
                                if (servers[j].priority <= priority) {
                                    lowestServerUrl = onlineServers[i].url;
                                    priority = servers[j].priority;
                                }

                    //lowest server priority data
                    var lowestServer = {
                        url: lowestServerUrl,
                        priority: priority
                    }
                    resolve(lowestServer);
                }
            });
        });
    }
}

//check response status
function checkStatus(res) {
    if (res.ok && res.status >= 200 && res.status <= 299)
        return Promise.resolve(res);
    else
        return Promise.reject(new Error(res.statusText));
}