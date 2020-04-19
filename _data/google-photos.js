'use strict';

const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
let drive;

const getCredentials = () => {
  const filePath = path.join(__dirname, 'keys.json');
  if (fs.existsSync(filePath)) {
    return require(filePath);
  }
  if (process.env.CREDENTIALS) {
    return JSON.parse(process.env.CREDENTIALS);
  }
  throw new Error('Unable to load credentials');
}

const initializeDrive = async () => {
  const credentials = getCredentials();
  const client = await google.auth.getClient({
    credentials,
    scopes: 'https://www.googleapis.com/auth/drive.readonly'
  });
  drive = google.drive({
    version: 'v2',
    auth: client
  });
}

async function downloadFile({id, title}) {
  const filePath = `./static/images/google-photos/${title}`

  if (fs.existsSync(filePath)) {
    return;
  }

  drive.files.get({
    fileId: id,
    alt: 'media'
  },{ responseType: 'stream' },
  (err, res) => {
    if (!res)
      return;
    res.data
      .on('end', () => console.log('Done'))
      .on('error', err => console.log('Error', err))
      .pipe(fs.createWriteStream(filePath));
  })
}

module.exports = function() {
  initializeDrive().then(i => {
    drive.files.list({
      "q": "'1U50mOp8U-8LpcxiLL7psyFuN1jJyYkGJ' in parents"
    })
    .then(res => res.data.items.map(file => {
      downloadFile(file);
      return file.title;
    }))
    .catch(e => console.error(e));
  });
};