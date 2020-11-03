const fs = require('fs');

// Returns list of file names
function GetAllGameFiles() {
    let res = fs.readdirSync("./GameIDs");

    return res;
}

function ReadAllGameFiles() {
    fs.readdirs("./GameIDs", (err, files) => {
        if (err) {
            console.log("READALLERR: " + err);
        }
        console.log(files);

        for (let i = 0; i < files.length; i++) {
            ReadGameIDs(files[i]);
        }
    });
}


/// ReadGameIDs
// Input: fileName - filename of array containing game ids
// Output: array of gameIds

function ReadGameIDs(fileName) {
    //console.log("Reading: " + fileName);

    let data = fs.readFileSync("./GameIDs/" + fileName);
    return JSON.parse(data.toString());
}

function ReadFile(fileName) {
    console.log("Reading: " + fileName);

    let data = fs.readFileSync("./GameData/" + fileName);
    console.log(JSON.parse(data.toString()));
}

exports.GetAllGameFiles = GetAllGameFiles;
exports.ReadGameIDs = ReadGameIDs;
exports.ReadFile = ReadFile;