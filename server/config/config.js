const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    'userpersonaldetails',
    'root',
    '', {
        host: 'localhost',
        dialect: 'mysql',
        operatorsAliases: false,
    }
)

sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('../models/User')(sequelize, DataTypes)

db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
});

module.exports = db;