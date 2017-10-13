"use strict";

module.exports = function(sequelize, DataTypes) {
    const Movie = sequelize.define('Movie', {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        poster_small: DataTypes.STRING,
        poster_big: DataTypes.STRING,
        end_date: DataTypes.DATEONLY
    });

    Movie.associate = function(models) {
        Movie.belongsToMany(models.Technology, {
            through: 'MovieTechnologies'
        });
    }
    
    return Movie;
}