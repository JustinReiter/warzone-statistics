const request = require('sync-request');

// Return ladder game IDs to find new games
function getLadderGameIDs(ladderid) {
    return JSON.parse(request('POST', process.env.WZ_BASE_URL + "/GameIDFeed?LadderID=" + ladderid, {
                    Email: encodeURIComponent(process.env.WZ_EMAIL),
                    APIToken: encodeURIComponent(process.env.WZ_TOKEN)
                }).getBody('utf-8'));
}

// Return game data to add new games to database
function getLadderGameData(gameid) {
    return JSON.parse(request('POST', process.env.WZ_BASE_URL + "/GameFeed?GameID=" + gameid, {
                body: encodeURI(`Email=${process.env.WZ_EMAIL}&APIToken=${process.env.WZ_TOKEN}`)
            }).getBody('utf-8'));
}

module.exports = {
    getLadderGameIDs,
    getLadderGameData
};
