var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var axios = require('axios').default;


async function formatTeamObject(cell, playersStr) {
    const reqstr = `Email=${process.env.WZ_EMAIL}&APIToken=${process.env.WZ_TOKEN}`;
    let clan = {name: cell.attribs["data-clan"]};

    let players = [];
    for (const player of playersStr.split(".")) {
        let playerData = await axios.post(process.env.WZ_PLAYER_API + "?Token=" + player, reqstr);
        players.push({name: playerData.data.name, id: player});
    }
    clan.players = players;

    return clan;
}

/* GET colour data listings. */
router.get('/', function(req, res, next) {
    // Scrape the CLOT page to find the players & game results

    // games: { division: {template: [{winner: {clan, players}, losers, link}]}}}
    let games = {};

    axios.get(process.env.CLOT_URL).then(async (html) => {
        const $ = cheerio.load(html.data);
        
        // Web scrape page for links
        let tables = $('table');

        
        for (let table of tables) {
            if (table.attribs.id || table.attribs.class == null || table.attribs.class.indexOf("clot_table") == -1) continue;
            
            // All remaining tables reflect CL game tables to parse
            
            let tablerows = table.children[0].children;
            let division = tablerows[0].children[0].children[0].data.substring(0, 10);
            let template = tablerows[0].children[0].children[0].data.substring(13);
            
            // Init games object if div/template does not exist
            if (!(division in games)) {
                games[division] = {};
            }
            if (!(template in games[division])) {
                games[division][template] = [];
            }

            let topteams = tablerows[0].children;
            // Get rid of first cell of row (shows div/template)
            topteams.slice(0, 1);
            // Get rid of first row of table (shows teams)
            tablerows.slice(0, 1);

            for (let i = 0; i < tablerows.length; i++) {
                let leftteam = tablerows[i].children[0];
                tablerows[i].children.slice(0, 1);

                for (let col = 0; col < tablerows[i].children.length; col++) {
                    // parse game cells
                    let cells = tablerows[i].children;
                    if ("style" in cells[col].attribs) {
                        // cell has game
                        if (cells[col].attribs.style.indexOf("ffe7a3") != -1) {
                            // Game in progres
                            games[division][template].push({link: cells[col].children[0].attribs.href, winners: {name: leftteam.attribs["data-clan"]}, losers: {name: topteams[col].attribs["data-clan"]}, isFinished: false});
                        } else {
                            let newgame = {link: cells[col].children[0].attribs.href};
            
                            if (cells[col].attribs.style.indexOf("#FBDFDF") != -1) {
                                // Top team won
                                newgame.winners = await formatTeamObject(topteams[col], cells[col].attribs["data-players"].split("-")[0]);
                                newgame.losers = await formatTeamObject(leftteam, cells[col].attribs["data-players"].split("-")[1]);
                            } else {
                                // Let team won
                                newgame.winners = await formatTeamObject(leftteam, cells[col].attribs["data-players"].split("-")[0]);
                                newgame.losers = await formatTeamObject(topteams[col], cells[col].attribs["data-players"].split("-")[1]);

                            }
                            newgame.isFinished = true;
                            games[division][template].push(newgame);
                        }
                    }
                }
            }

            console.log(`Finished processing ${division} - ${template}`);
        }

        res.json(games);
    });
});

module.exports = router;
