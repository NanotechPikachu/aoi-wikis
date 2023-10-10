const sqlite3 = require('sqlite3').verbose();

// Open the SQLite database
const db = new sqlite3.Database('giveaways.db');

// Create the participants table if it doesn't exist
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS participants (giveawayId TEXT, userId TEXT)');
  db.run("CREATE TABLE IF NOT EXISTS giveaways (id TEXT PRIMARY KEY, guildId TEXT, channelId TEXT, prize TEXT, endTime INTEGER, winnerCount INTEGER)");
});

// Function to add a user to the database when they enter a giveaway
async function addUserToGiveawayDB(giveawayId, userId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM participants WHERE giveawayId = ? AND userId = ?', [giveawayId, userId], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve('User has already entered the giveaway.');
      } else {
        const stmt = db.prepare('INSERT INTO participants (giveawayId, userId) VALUES (?, ?)');
        stmt.run(giveawayId, userId, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve('User added to the giveaway.');
          }
        });
        stmt.finalize();
      }
    });
  });
}

// Function to fetch participants from the database based on giveawayId
function fetchParticipantsFromDB(giveawayId) {
  return new Promise((resolve, reject) => {
    db.all('SELECT userId FROM participants WHERE giveawayId = ?', [giveawayId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const participants = rows.map(row => row.userId);
        resolve(participants);
      }
    });
  });
}

// Function to remove a giveaway and its participants from the database
function deleteGiveaway(giveawayId) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM giveaways WHERE id = ?', [giveawayId], (err) => {
      if (err) {
        reject(err);
      } else {
        db.run('DELETE FROM participants WHERE giveawayId = ?', [giveawayId], (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
}


//function which adds a giveaway to the DB
function addGiveaway(giveawayId, guildId, channelId, prize, endTime, winnerCount) {
  const stmt = db.prepare("INSERT INTO giveaways VALUES (?, ?, ?, ?, ?, ?)");
  stmt.run(giveawayId, guildId, channelId, prize, endTime, winnerCount);
  stmt.finalize();
}

//function to get the giveaway details from the DB
function getGiveawayDetails(giveawayId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT guildId, channelId, prize, endTime, winnerCount FROM giveaways WHERE id = ?";
    
    db.get(query, [giveawayId], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        const giveawayDetails = {
          guildId: row.guildId,
          channelId: row.channelId,
          prize: row.prize,
          endTime: row.endTime,
          winnerCount: row.winnerCount,
        };
        resolve(giveawayDetails);
      } else {
        // No matching giveaway found
        resolve(null);
      }
    });
  });
}


module.exports = {
  addUserToGiveawayDB,
  fetchParticipantsFromDB,
  deleteGiveaway,
  addGiveaway,
  getGiveawayDetails,
};
