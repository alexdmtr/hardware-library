const fs = require('fs');
const readline = require('readline');
const google = require('googleapis').google;
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = 'credentials.json';

var finishAuthorizaton = new Promise((resolve, reject) => {

    //Load client secrets from a local file.
    fs.readFile('client_secret.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content))
            .then(auth => {
                resolve(auth);
            });
    });
})

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
    return new Promise((resolve, reject) => {
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            resolve(oAuth2Client);
        });
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return callback(err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

module.exports.addHardwareRequest = function (items, hackerName) {

    finishAuthorizaton.then(addRequest);
    function addRequest(auth) {
        const sheets = google.sheets({ version: 'v4', auth });
        var body = {
            values: 
                items.map(item => {
                    return [hackerName, item.name, item.quantity, new Date().toLocaleString()]
                })
            // [
            //     ["Alex Dumitru", "Raspberry Pi", "1", new Date().toLocaleString()]
            // ]
        }
        sheets.spreadsheets.values.append({
            spreadsheetId: '1fKgZy2eKINoR9JHc2LFQzRrGBvUnKNVDLX3CUH4ELSE',
            range: 'Taken!A2:D2',
            resource: body,
            valueInputOption: "RAW",
            auth: auth
        }, function (err, result) {
            if (err) {
                // Handle error
                console.log(err);
            } else {
                console.log('ok');
            }
        })

    }
    //   sheets.spreadsheets.values.get({
    //     spreadsheetId: '1fKgZy2eKINoR9JHc2LFQzRrGBvUnKNVDLX3CUH4ELSE',
    //     range: 'Taken!A1:B1',
    //   }, (err, {data}) => {
    //     if (err) return console.log('The API returned an error: ' + err);
    //     console.log(data);
    //   });
}
// [END sheets_quickstart]
