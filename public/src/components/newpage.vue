<template>
<div class="edit-page">
	<div class="edit-page__field">
		<h1 v-if="!isNew()">Редагувати фільм</h1>
		<h1 v-if="isNew()">Створити новий фільм</h1>
	</div>
		<div class="edit-page__field">
			<label for="name" class="edit-page__label">Ім'я</label>
			<div class="form">
				<input type="text" v-model="movie_data.name" v-validate="{required: true}" name="name" class="edit-page__input form__text-input">
				<div v-if="errors.has('name')">Имя не может быть пустым</div>
			</div>
		</div>
		<div class="edit-page__field">
			<label for="description" class="edit-page__label">Описание</label>
			<div class="form">
				<textarea v-model="movie_data.description" v-validate="{required: true}" name="description" class="edit-page__input edit-page__textarea form__textarea">
				</textarea>
				<div v-if="errors.has('poster_big')">Описание не может быть пустым</div>
			</div>
		</div>
		<div class="edit-page__field">
			<label for="poster_big" class="edit-page__label">Посилання на большой постер</label>
			<div class="form">
				<input type="text" v-model="movie_data.poster_big" v-validate="{required: true, url: true}" name="poster_big" class="edit-page__input form__text-input form__text-input">
				<div v-if="errors.has('poster_big')">Ссылка в неверном формате</div>
			</div>
		</div>
		<div class="edit-page__field">
			<label for="poster_small" class="edit-page__label">Посилання на малый постер</label>
			<div class="form">
				<input type="text" v-model="movie_data.poster_small" v-validate="{required: true, url: true}" name="poster_small" class="edit-page__input form__text-input">
				<div v-if="errors.has('poster_small')">Ссылка в неверном формате</div>
			</div>
		</div>
		<div class="edit-page__field">
			<label for="technologies" class="edit-page__label">Технології</label>
			<div class="form">
				<input type="text" v-model="movie_data.technologies" v-validate="{ regex: /^[A-Za-z0-9 ,]*$/ }" name="technologies" class="edit-page__input form__text-input">
				<div v-if="errors.has('technologies')">Список технологій у невірному форматі (приклад: "IMAX, 3D")</div>
			</div>
		</div>
		<div class="edit-page__field form">
			<label class="edit-page__label" for="end-date">Дата закінчення</label>
			<datepicker v-model="movie_data.end_date" name="end-date" input-class="edit-page__input form__text-input" format="dd/MM/yyyy"></datepicker>
		</div>
		<div class="edit-page__field form">
			<button class="edit-page__button form__button form__button_solid" v-on:click="save">Зберегти</button>
			<button class="edit-page__button form__button form__button_empty" v-on:click="openMoviePage(movie_data.id)" v-if="!isNew()">Перейти до фільму</button>
		</div>
</div>
</template>

<script>
'use strict';

import Datepicker from 'vuejs-datepicker';
import Utils from 'js/utils.js';

export default {
    data: function() {
        return {
            movie_data: {}
        }
    },
    components: {
        Datepicker
    },
    methods: {
        isNew: function() {
            return (this.$route.path === '/new');
        },
        openMoviePage: function(id) {
            this.$router.push(`/films/${id}`)
        },
        save: function() {
            let data_obj = Object.assign({}, this.movie_data);

            //Convert technologies string to array of objects
            data_obj.technologies = Utils.arrayToObjectsArray(Utils.trimAndSplit(data_obj.technologies), 'name');

            if (this.isNew()) {
                this.resources.movie.save({}, data_obj).then(data => {
                    this.openMoviePage(data.body.id);
                }).catch(data => {
                    this.goToError();
                });
            } else {
                this.resources.movie.update({
                    id: this.$route.params.id
                }, data_obj).then(data => {
                    this.openMoviePage(data.body.id);
                }).catch(data => {
                    this.goToError();
                });
            }

        },
        goTo404: function() {
            this.$router.push('/404');
        },
        goToError: function() {
            this.$router.push('/error');
        }
    },
    mounted: function() {
        if (!this.isNew()) {
            this.resources.movie.get({
                id: this.$route.params.id
            }).then(response => {
                this.movie_data = response.body;

                //convert Technologies from array to string, so they can be edited in text field
                this.movie_data.technologies = Utils.objectsArrayToString(this.movie_data.Technologies, 'name');
            }).catch(err => {
            	this.goToError();
            })
        }
    }
}
</script>

<style lang="scss">
.edit-page{
	padding-left: 160px;
    padding-right: 160px;
}

.edit-page .edit-page__label{
	font-size: 20px;
	margin-bottom: 10px;
	display: inline-block;
	font-weight: bold;
}

.edit-page .edit-page__field{
	margin-bottom: 30px;
	margin-top: 30px;
	width: 400px;
}

.edit-page .edit-page__input{
	width: 100%;
}


.edit-page .edit-page__textarea{
	height: 200px;
}

.edit-page .edit-page__button{
    width: 185px;
    height: 40px;
}
</style>