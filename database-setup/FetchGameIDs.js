const postUrl = "https://www.warzone.com/API/GameIDFeed?LadderID=";
// curl -ks --data-urlencode "Email=justin.reiter.1@gmail.com" --data-urlencode "APIToken=$apitoken" POST https://www.warzone.com/API/GameIDFeed?LadderID=0

const fs = require('fs');
const request = require('request');

/// LADDER IDs
// 1v1 - 0
// 2v2 - 1
// ??? - 2
// RTL - 3
// 3v3 - 4
// Seasonals - 4000-4032 & 4065-4069

const names = ["1v1LadderGames", "2v2LadderGames", "", "RTLadderGames", "3v3LadderGames", "SeasonalGames"];
const ladders = [4075, 4076];

for (const ladder of ladders) {
    request.post({
        url: postUrl + ladder,
        body: encodeURI(`Email=justin.reiter.1@gmail.com&APIToken=${process.argv[2]}`)
    }, (error, res, body) => {
        if (error) {
            console.error(error);
            return;
        }
        
        let name;
        if (ladder == 4075) {
            name = "Seasonal XLI";
        } else {
            name = "Seasonal XLII";
        }
        writeContents(JSON.parse(body).gameIDs, name);
    });
}

function writeContents(payload, name) {
    fs.writeFile("./GameIDs/" + name, JSON.stringify(payload), (err) => {
        if (err) throw err;
        console.log("Saved File Successfully - " + name);
    });
}
