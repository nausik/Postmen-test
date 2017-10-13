const Express = require('express'),
    Path = require('path'),
    BodyParser = require('body-parser'),
    Sequelize = require('sequelize');

const app = Express(),
    port = process.env.PORT || "3544",
    models = require('./models');

app.use(Express.static('public'));
app.use(BodyParser.json());

models.sequelize.sync({
    force: true
});

app.get('/movies/search/:query', (req, res) => {
    let limit = 10;

    res.setHeader('Content-Type', 'application/json');

    models.Movie.findAll({
        limit,
        where: {
            name: {
                [Sequelize.Op.like]: `%${req.params.query}%`
            },
            end_date: {
                [Sequelize.Op.gt]: new Date()
            }
        },
        include: [{
            model: models.Technology,
            attributes: ['name'],
            through: {
                attributes: []
            }
        }]
    }).then(movies => {
        res.send(JSON.stringify(movies));
    }).catch(err => {
        errorHandler(res);
    });
});

app.get('/movies/:offset/:limit', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    models.Movie.findAll({
        limit: req.params.limit,
        offset: req.params.offset,
        order: [
            Sequelize.fn('max', Sequelize.col('end_date'), 'DESC')
        ],
        where: {
            end_date: {
                [Sequelize.Op.gt]: new Date()
            }
        },
        include: [{
            model: models.Technology,
            attributes: ['name'],
            through: {
                attributes: []
            }
        }]
    }).then(movies => {
        res.send(JSON.stringify(movies));
    }).catch(err => {
        errorHandler(res);
    });
});

app.get('/movie/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    if (typeof req.params.id !== 'undefined') {
        models.Movie.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: models.Technology,
                attributes: ['name'],
                through: {
                    attributes: []
                }
            }]
        }).then(data => {
            return Promise.all([data.toJSON(), getSimilarMovies(data)]);
        }).then(data => {
            let json_data,
                similar_movies;

            [json_data, similar_movies] = data;

            json_data.similar = similar_movies;

            res.send(JSON.stringify(json_data));
        }).catch(err => {
            res.send(JSON.stringify({}));
        })
    } else {
        return res.send(JSON.stringify({}));
    }
});

app.post('/movie', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    createMovie(req.body, res);
});

app.put('/movie/:id', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    updateMovie(req.params.id, req.body, res);
});

function getSimilarMovies(movie) {
    return movie.getTechnologies().then(technologies => {
        let technology_ids = pluck(technologies, 'id'),
            movies_search_params = {
                limit: 5,
                order: [
                    Sequelize.fn('max', Sequelize.col('end_date'), 'DESC')
                ],
                end_date: {
                    [Sequelize.Op.gt]: new Date()
                }
            };

        //Check if movie has Technologies
        if (technology_ids.length > 0) {
            movies_search_params.include = [{
                model: models.Technology,
                where: {
                    id: technology_ids
                }
            }];
        }

        return models.Movie.findAll(movies_search_params);
    });
}

function createMovie(movie_data, response) {
    let movie_create_promise = models.Movie.create(movie_data),
        technologies_create_promise = models.Technology.bulkCreate(movie_data.technologies, {
            ignoreDuplicates: true
        }).then(() => models.Technology.findAll({
            where: {
                name: pluck(movie_data.technologies, 'name')
            }
        }));

    Promise.all([movie_create_promise, technologies_create_promise]).then((data) => {
        let movie_promise_result, technologies_promise_result;

        [movie_promise_result, technologies_promise_result] = data;

        //Pass movie object, so we can send it to client
        return [movie_promise_result, movie_promise_result.setTechnologies(technologies_promise_result)];
    }).then((data) => {
        return response.send(JSON.stringify(data[0].dataValues));
    }).catch(err => {
        errorHandler(response);
    });
}

function updateMovie(id, movie_data, response) {
    let movie_update_promise = models.Movie.update(movie_data, {
            where: {
                id
            }
        }).then((data) => {
            return models.Movie.findOne({
                where: {
                    id
                }
            })
        }),
        technologies_create_promise = models.Technology.bulkCreate(movie_data.technologies, {
            ignoreDuplicates: true
        }).then(() => models.Technology.findAll({
            where: {
                name: pluck(movie_data.technologies, 'name')
            }
        }));

    Promise.all([movie_update_promise, technologies_create_promise]).then((data) => {
        let movie_promise_result, technologies_promise_result;

        [movie_promise_result, technologies_promise_result] = data;
        //Pass movie object, so we can send it to client
        return [movie_promise_result, movie_promise_result.setTechnologies(technologies_promise_result)];
    }).then((data) => {
        return response.send(JSON.stringify(data[0].dataValues));
    }).catch(err => {
        errorHandler(response);
    });
}

function pluck(array, key) {
    return array.map(o => o[key]);
}

function errorHandler(res) {
    res.status(500).send(JSON.stringify({
        error: "Something failed"
    }));
}

app.get('*', (req, res) => {
    res.sendFile(Path.join(__dirname, './public', 'index.html'));
});

app.listen(port, () => {
    console.log('Web server started');
});