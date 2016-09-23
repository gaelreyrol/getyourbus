const menubar = require('menubar');
const path = require('path');
const moment = require('moment');
const notifier = require('node-notifier');
const { CronJob } = require('cron');

const packageJson = require('../package.json');
let timeTable = require('./timetable.json');
const startNotificationHour = moment().hours(17);

const mb = menubar({
  dir: path.resolve(__dirname),
  tooltip: packageJson.description
});

for (var i = 0; i < timeTable.hours.length; i++) {
  const busStop = moment().hours(timeTable.hours[i].split('h')[0]).minutes(timeTable.hours[i].split('h')[1]);
  timeTable.hours[i] = busStop;
}

function getNextBuses() {
  const now = moment();
  const nextBuses = [];

  for (var i = 0; i < timeTable.hours.length; i++) {
    const diffMinutes = timeTable.hours[i].diff(now, 'minutes');
    if (diffMinutes > 0 && diffMinutes < 30) {
      nextBuses.push(diffMinutes);
    }
  }

  return nextBuses;
}

const job = new CronJob('* * * * *', () => {
  const now = moment();
  if (now.isAfter(startNotificationHour)) {
    const nextBuses = getNextBuses();

    notifier.notify({
      icon: path.join(__dirname, 'iconTemplate@2x.png'),
      contentImage: 0,
      title: 'Get your bus',
      message: 'Prochain bus dans ' + nextBuses[0] + ' minutes'
    });
  }

}, () => {

}, false, 'Europe/Paris');
job.start();

mb.on('ready', () => {
  console.log('App is ready');
});

mb.on('show', () => {

});
