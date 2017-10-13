'use strict';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VeeValidate from 'vee-validate';
import VueResource from 'vue-resource';
import VueInfiniteScroll from 'vue-infinite-scroll';
import MoviePageComponent from 'components/moviepage.vue';
import NewPageComponent from 'components/newpage.vue';
import ErrorPageComponent from 'components/errorpage.vue';
import MainPageComponent from 'components/mainpage.vue';

require('styles/index.scss');

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueInfiniteScroll);
Vue.use(VeeValidate, {
    classes: true,
    events: 'blur'
});

Vue.mixin({
    data: function() {
        return {
            resources: {
                movie: Vue.resource('/movie{/id}')
            }
        }
    }
});

const routes = [{
        path: '/',
        component: MainPageComponent
    }, {
        path: '/films/:id',
        component: MoviePageComponent
    }, {
        path: '/new',
        component: NewPageComponent
    }, {
        path: '/films/:id/edit',
        component: NewPageComponent
    }, {
        path: '/error',
        component: ErrorPageComponent
    }, {
        path: '/404',
        component: ErrorPageComponent
    }],
    router = new VueRouter({
        mode: 'history',
        routes,
        scrollBehavior(to, from, savedPosition) {
            return {
                x: 0,
                y: 0
            }
        }
    }),
    app = new Vue({
        el: '#app',
        router
    });