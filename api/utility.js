

function handleQueryError(err, res) {
    console.log(err);
    res.json({error: "Error while processing query"});
}

function formatDateString(date) {
    return new Date(date).toISOString().slice(0, 19).replace("T", " ");
}

module.exports = {
    handleQueryError,
    formatDateString
};
