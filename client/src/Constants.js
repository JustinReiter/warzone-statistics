const home = ``;

const LandingPageTitle = 'Warzone Statistics';
const LandingPageDescription = 'This platform contains data covering the entire seasonal ladder on Warzone.' +
                                    ' If you notice anything incorrect or off, please send a screenshot to me (JustinR17) with the issue.';

const LandingPageSeasonalTitle = 'Recent Seasons';
const LandingPageSeasonalDescription = 'Here are the 4 last seasons. To view any past season, visit the \'Ladders\' page';

const LaddersPageTitle = `Ladders`;
const LaddersPageDescription = `This page contains information about all ladders. Click on a specific ladder to view more statistics`;

const warzoneGameUrl = 'https://www.warzone.com/MultiPlayer?GameID=';
const warzoneProfileUrl = 'https://www.warzone.com/Profile?p=';
const warzoneSeasonUrl = 'https://www.warzone.com/LadderSeason?ID=';
const warzoneTemplateURL = 'https://www.warzone.com/MultiPlayer?TemplateID=';

// Warzone colour mapping
const colourMapping = {
    "8f9779": "Artichoke",
    "59009d": "Purple",
    "ff7d00": "Orange",
    "606060": "Dark Gray",
    "ff697a": "Hot Pink",
    "00ff8c": "Sea Green",
    "009b9d": "Teal",
    "ac0059": "Dark Magenta",
    "ffff00": "Yellow",
    "feff9b": "Ivory",
    "b70aff": "Electric Purple",
    "ff00b1": "Deep Pink",
    "4effff": "Aqua",
    "008000": "Dark Green",
    "ff0000": "Red",
    "00ff05": "Green",
    "94652e": "Saddle Brown",
    "ff4700": "Orange Red",
    "23a0ff": "Light Blue",
    "ff87ff": "Orchid",
    "943e3e": "Brown",
    "ad7e7e": "Copper Rose",
    "ffaf56": "Tan",
    "8ebe57": "Lime",
    "0000ff": "Blue",
    "990024": "Tyrian Purple",
    "880085": "Mardi Gras",
    "4169e1": "Royal Blue",
    "ff43a4": "Wild Strawberry",
    "100c08": "Smoky Black",
};

const seasonMapping = {
    4000: "Season I",
    4001: "Season II",
    4002: "Season III",
    4003: "Season IV",
    4004: "Season V",
    4005: "Season VI",
    4006: "Season VII",
    4007: "Season VIII",
    4008: "Season IX",
    4009: "Season X",
    4010: "Season XI",
    4011: "Season XII",
    4012: "Season XIII",
    4013: "Season XIV",
    4014: "Season XV",
    4015: "Season XVI",
    4016: "Season XVII",
    4017: "Season XVIII",
    4018: "Season XIX",
    4019: "Season XX",
    4020: "Season XXI",
    4021: "Season XXII",
    4022: "Season XXIII",
    4023: "Season XXIV",
    4024: "Season XXV",
    4025: "Season XXVI",
    4026: "Season XXVII",
    4027: "Season XXVIII",
    4028: "Season XXIX",
    4029: "Season XXX",
    4030: "Season XXXI",
    4031: "Season XXXII",
    4032: "Season XXXIII",
    4065: "Season XXXIV",
    4066: "Season XXXV",
    4067: "Season XXXVI",
    4068: "Season XXXVII",
    4069: "Season XXXVIII",
    4070: "Season XXXIX",
    4074: "Season XL",
    4075: "Season XLI",
    4076: "Season XLII"
};

export {
    home,
    LandingPageTitle,
    LandingPageDescription,
    LandingPageSeasonalTitle,
    LandingPageSeasonalDescription,
    LaddersPageTitle,
    LaddersPageDescription,
    colourMapping,
    seasonMapping,
    warzoneGameUrl,
    warzoneProfileUrl,
    warzoneSeasonUrl,
    warzoneTemplateURL
};