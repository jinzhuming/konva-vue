<template>
  <div style="position: fixed; right: 10px; bottom: 20px; color: rgba(0, 0, 0, 0.4)">{{ str }}</div>
</template>

<script setup lang="ts">
import { inject } from "vue";

const str = inject<string>("helper");
</script>
