<template>
<div v-infinite-scroll="getMoviesData" class="main-page">
	<div class="main-page__header">
		<div class="content__subtitle main-page__subtitle" v-if="!isSearch()">Сьогодні у кіно</div>
		<div class="content__subtitle main-page__subtitle" v-if="isSearch()">Пошук</div>
		<div class="main-page__menu form">
			<div>
				<input type="text" placeholder="Пошук" v-model="search_query" v-on:input="search" v-on:blur="search" class="form__text-input  main-page__text-input">
			</div>
			<div>
				<button class="form__button form__button_solid main-page__button" v-on:click="goToNewMovie">Додати фільм</button>
			</div>
		</div>
	</div>
	<div class="main-page__cards-row cards-row" v-if="!isSearch()" infinite-scroll-disabled="infinite_scroll_disabled" infinite-scroll-distance="10">
		<card v-for="movie_data in movies_data" :key="movie_data.id" :data="movie_data" additional-class="main-page__card"></card>
	</div>
	<div class="main-page__cards-row cards-row" v-if="isSearch()">
		<card v-for="movie_data in search_results" :key="movie_data.id" :data="movie_data" additional-class="main-page__card"></card>
		<div class="content__subtitle main-page__subtitle">Не знайдено жодного фільму :(</div>
	</div>
</div>
</template>

<script>
'use strict';

import Card from 'components/card.vue';

let infinite_scroll_params = {
    current_offset: 0,
    limit: 10,
    reset: function() {
        this.current_offset = 0;
    },
    incrementOffset: function() {
        this.current_offset += this.limit;
    }
};

export default {
    data: function() {
        return {
            movies_data: [],
            scroll_disabled: false,
            search_query: "",
            search_results: []
        }
    },
    components: {
        Card
    },
    methods: {
        isSearch: function() {
            return (this.search_query.length > 0);
        },
        getMoviesData: function() {
            this.infinite_scroll_disabled = true;

            this.$http.get(`/movies/${infinite_scroll_params.current_offset}/${infinite_scroll_params.limit}`).then(data => {
                this.movies_data = this.movies_data.concat(data.body);

                if (data.body.length === infinite_scroll_params.limit) {
                    this.infinite_scroll_disabled = false;
                }
            }).catch(err => {
                this.goToError();
            });

            infinite_scroll_params.incrementOffset();
        },
        search: function() {
            this.$http.get(`/movies/search/${this.search_query}`).then(data => {
                this.search_results = data.body;
            }).catch(err => {
                this.goToError();
            });
        },
        goToNewMovie: function() {
            this.$router.push('/new');
        },
        goTo404: function() {
            this.$router.push('/404');
        },
        goToError: function() {
            this.$router.push('/error');
        }
    },
    mounted: function() {
        infinite_scroll_params.reset();
        this.getMoviesData();
    }
}
</script>

<style lang="scss">
.main-page{
	padding-left: 49px;
	padding-right: 49px;
}

.main-page .main-page__header{
	padding-left: 30px;
	padding-right: 30px;
	margin-bottom: 30px;
}

.main-page .main-page__card{
	margin-left: 15px;
    margin-right: 15px;
    margin-bottom: 30px;
    display: inline-block;
}

.main-page .main-page__subtitle{
	margin-bottom: 20px;
	margin-top: 20px;
}

.main-page .main-page__text-input{
	width: 185px;
	margin-bottom: 30px;
}

.main-page .main-page__button{
	width: 185px;
    height: 40px;
}
</style>