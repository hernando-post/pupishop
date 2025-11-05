<template>
     <Navbar v-if="!$route.meta.hideNavbar" />
    <router-view></router-view>
</template>

<script setup>
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
</script>
