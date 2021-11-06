const postURL = "https://www.warzone.com/API/GameFeed?GameID=";

const fs = require('fs');
const request = require('sync-request');
const readData = require('./ReadFiles.js');


function SaveAllGameData() {
    let filesToParse = readData.GetAllGameFiles();

    for (let i = 0; i < filesToParse.length; i++) {
        let gameIDs = readData.ReadGameIDs(filesToParse[i]);

        for (let j = 0; j < gameIDs.length; j++) {
            GetGameData(gameIDs[j], filesToParse[i]);
        }
    }
}

function SaveOneLadder() {
    let filesToParse = readData.GetAllGameFiles();
    for (let i = 0; i < filesToParse.length; i++) {

        if (filesToParse[i] === process.argv[3]) {
	    let gameIDs = readData.ReadGameIDs(filesToParse[i]);
            for (let j = 0; j < gameIDs.length; j++) {
                GetGameData(gameIDs[j], filesToParse[i]);
            }
        }
    }
}


function GetGameData(gameID, ladderName) {
    console.log(`\tGetting Game Data: ${gameID}`);


    var res = request('POST', postURL + gameID, {
        body: encodeURI(`Email=justin.reiter.1@gmail.com&APIToken=${process.argv[2]}`)
    });

    fs.writeFile(`./GameData/${ladderName}/${gameID}.json`, JSON.stringify(JSON.parse(res.getBody('utf8'))), (err) => {
        if (err) {
            console.log("\t\tGAMEDATAWRITEERR: " + err);
        }
        console.log(`\t\tSuccessfully Saved File - ${gameID}.json`);
    });
}

// let testGames = [1415698, 1606766,2611223,2611222,1619970];
// for (let i = 0; i < testGames.length; i++) {
//     GetGameData(testGames[i]);
// }

function GetLadderIDLength() {
    let filesToParse = readData.GetAllGameFiles();

    for (let i = 0; i < filesToParse.length; i++) {
        let gameIDs = readData.ReadGameIDs(filesToParse[i]);

        console.log(filesToParse[i] + ": " + gameIDs.length);
    }
}

// GetLadderIDLength();
// SaveAllGameData();
SaveOneLadder();
