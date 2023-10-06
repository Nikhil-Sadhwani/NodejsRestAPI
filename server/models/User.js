module.exports = (sequelize, DataTypes) => {

    const user = sequelize.define("users", {
        user_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        user_password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_image: {
            type: DataTypes.STRING
        },
        total_orders: DataTypes.INTEGER,
        last_logged_in: DataTypes.DATE,

    
    })

    return user

}