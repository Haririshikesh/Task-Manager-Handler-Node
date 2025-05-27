module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Task title cannot be an empty string.' }
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed'),
            defaultValue: 'pending',
            allowNull: false
        },
        dueDate: {
        type: DataTypes.DATE, 
        allowNull: true, 
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    },{
        tableName: 'tasks',
        timestamps: true,
        underscore: true,
    });

    return Task;
}