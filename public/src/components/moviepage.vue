<template>
<div class="movie-page">
	<div class="movie-page__poster movie-page-poster" :style="{ 'background-image': 'url(' + movie_data.poster_big + ')' }">
		<div class="movie-page-poster__header">
			{{movie_data.name}}
		</div>
	</div>
	<div class="movie-page__content" style="white-space: pre-line;">
		{{movie_data.description}}
	</div>
	<div class="movie-page__row form">
		<div>
			<button class="form__button form__button_solid movie-page__button" v-on:click="goToList">
			Повернутися
			</button>
		</div>
		<div>
			<button class="form__button form__button_empty movie-page__button" v-on:click="goToEdit">
			Редагувати
			</button>
		</div>
	</div>
	<div class="movie-page__row">
		<div class="content__subtitle movie-page__subtitle">
			Інші фільми
		</div>
	</div>

	<div class="movie-page__cards-row cards-row">
		<card v-for="card in movie_data.similar" :key="card.id" :data="card" additional-class="movie-page__card"></card>
	</div>
</div>
</template>

<script>
'use strict';

import Card from 'components/card.vue';

export default {
    data: function() {
        return {
            movie_data: {}
        }
    },
    components: {
        Card
    },
    methods: {
        getData: function() {
            this.resources.movie.get({
                id: this.$route.params.id
            }).then(response => {
                if (Object.keys(response.body).length === 0) {
                    this.goTo404();
                }

                this.movie_data = response.body;
            }).catch(err => {
                this.goToError();
            });
        },
        goToEdit: function() {
            this.$router.push(`/films/${this.$route.params.id}/edit`);
        },
        goToList: function() {
            this.$router.push('/');
        },
        goTo404: function() {
            this.$router.push('/404');
        },
        goToError: function() {
            this.$router.push('/error');
        }
    },
    watch: {
        '$route': 'getData'
    },
    mounted: function() {
        this.getData();
    }
}
</script>

<style lang="scss">
.movie-page .movie-page__poster {
    height: 600px;
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    position: relative;
}
.movie-page .movie-page__row {
    padding-left: 160px;
    padding-right: 160px;
    box-sizing: border-box;
    display: flex; 
    justify-content: space-between; 
    margin-bottom: 30px; 
    margin-top: 30px;
}

.movie-page .movie-page__content {
    margin-top: 60px;
    padding-left: 160px;
    padding-right: 160px;
    font-size: 20px;
    letter-spacing: 0.4px;
}

.movie-page .movie-page__subtitle{
    margin-bottom: 20px;
}

.movie-page .movie-page__cards-row {
    margin-top: 30px;
    margin-bottom: 30px;
    padding-left: 15px;
    padding-right: 15px;
}

.movie-page .movie-page__card{
	margin-left: 30px;
    margin-right: 30px;
    display: inline-block;
}

.movie-page .movie-page__button{
    width: 185px;
    height: 40px;
}

.movie-page-poster__header {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 30px;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0.6px;
    text-align: left;
    line-height: 100px;
    color: #ffffff;
    padding-left: 160px;
    padding-right: 160px;
    box-sizing: border-box;
}

</style>