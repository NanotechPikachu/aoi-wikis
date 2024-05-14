/*
  FUNCTION: parseDuration()
  USE: To convert the time in short format to ms which will be acknowledged by node
  PARAMS: 
    'duration': | Type: 'String' |
*/

function parseDuration(duration) {
  const regex = /(\d+)([smhdw])/;
  const match = duration.match(regex);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000; // seconds
    case 'm':
      return value * 60 * 1000; // minutes
    case 'h':
      return value * 60 * 60 * 1000; // hours
    case 'd':
      return value * 24 * 60 * 60 * 1000; // days
    case 'w':
      return value * 7 * 24 * 60 * 60 * 1000; //weeks
    default:
      return null;
  };
};

module.exports = {
    parseDuration
};