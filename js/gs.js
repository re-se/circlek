var GoogleAuth, currentApiRequest, getDriveFileList, getSpreadSheets, handleAuthClick, handleClientLoad, initClient, insertData, isAuthorized, sendAuthorizedApiRequest, test, updateSigninStatus;

GoogleAuth = null;

handleClientLoad = function(cb) {
  return gapi.load('client:auth2', function() {
    return initClient(cb);
  });
};

initClient = function(cb) {
  return gapi.client.init({
    'apiKey': 'AIzaSyAYYH4PPq8kQAclo2M_Nwl2NT_cSKLu8EA',
    'clientId': '310646452936-s6agg92kiob0rpt7v512l8s40r4fejoc.apps.googleusercontent.com',
    'scope': ["https://www.googleapis.com/auth/spreadsheets", 'https://www.googleapis.com/auth/drive.metadata.readonly'].join(" "),
    'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4", "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
  }).then(function() {
    GoogleAuth = gapi.auth2.getAuthInstance();
    GoogleAuth.isSignedIn.listen(updateSigninStatus);
    return typeof cb === "function" ? cb() : void 0;
  });
};

handleAuthClick = function(cb) {
  if (cb == null) {
    cb = function() {};
  }
  if (!GoogleAuth.isSignedIn.get()) {
    return GoogleAuth.signIn().then(cb);
  }
};

isAuthorized = false;

currentApiRequest = void 0;

sendAuthorizedApiRequest = function(requestDetails) {
  currentApiRequest = requestDetails;
  if (isAuthorized) {
    return currentApiRequest = {};
  } else {
    return GoogleAuth.signIn();
  }
};

updateSigninStatus = function(isSignedIn) {
  if (isSignedIn) {
    isAuthorized = true;
    if (currentApiRequest) {
      return sendAuthorizedApiRequest(currentApiRequest);
    }
  } else {
    return isAuthorized = false;
  }
};

test = function() {
  return console.log(gapi.client.sheets.spreadsheets);
};

getDriveFileList = function(cb) {
  if (cb == null) {
    cb = function(res) {
      return console.log(res);
    };
  }
  return gapi.client.drive.files.list().then(cb);
};

getSpreadSheets = function(id, cb) {
  var sheets;
  if (cb == null) {
    cb = function() {};
  }
  sheets = [];
  return gapi.client.sheets.spreadsheets.get({
    spreadsheetId: id
  }).then(function(res) {
    var ps;
    ps = res.result.sheets.map(function(s) {
      sheets.push(s.properties.title);
      return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: s.properties.title
      });
    });
    return Promise.all(ps).then(function(res) {
      return cb(sheets, res);
    });
  });
};

insertData = function(id, range, values, cb) {
  if (cb == null) {
    cb = function(res) {
      return console.log(res);
    };
  }
  return gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: id,
    insertDataOption: "INSERT_ROWS",
    range: range,
    values: values,
    valueInputOption: "RAW"
  }).then(cb);
};
