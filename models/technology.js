"use strict";

module.exports = function(sequelize, DataTypes) {
    const Technology = sequelize.define('Technology', {
        name: {
            unique: true,
            type: DataTypes.STRING
        }
    });

    Technology.associate = function(models) {
        Technology.belongsToMany(models.Movie, {
            through: 'MovieTechnologies'
        });
    }

    return Technology;
}