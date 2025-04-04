<template>
  <CommonHeader v-if="route.path !== '/'" />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import CommonHeader from '@/components/CommonHeader.vue'
const route = useRoute()
</script>

<style scoped></style>
