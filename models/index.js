const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js');

const env = process.env.NODE_ENV || 'development';

const dbConfig = config[env];

const db = {};

let sequelize;
console.log('--- Database Connection Debugging ---');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('--- End Database Connection Debugging ---');

if(dbConfig.use_env_variable){
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        port: dbConfig.port,
        logging: dbConfig.logging,
    } );
}

const User = require('./User.js')(sequelize, DataTypes);
db.User = User;
const Task = require('./Task.js')(sequelize, DataTypes);
db.Task = Task;

//Associations
db.User.hasMany(db.Task, {
  foreignKey: 'userId',
  as: 'tasks',
  onDelete: 'CASCADE',
});

db.Task.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'user',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;