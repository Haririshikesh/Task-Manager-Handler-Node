const bcrypt = require('bcryptjs');
const { underscoredIf } = require('sequelize/lib/utils');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        // Model Attributes (Table columns)
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        googleId: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        }
    },{
        // Model Options 
        tableName : 'users',
        timestamps: true,
        underscored: true,
        hooks: {
            beforeCreate: async (user) => {
                if(user.password){
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user) => {
                if(user.changed('password') && user.password){
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    });

    User.prototype.isValidPassword = async function (password) {
        if(!password) {
            return false;
        }
        return await bcrypt.compare(password, this.password);
    };

    return User;
}