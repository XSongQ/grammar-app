<template>
  <v-card class="word-card">
    <v-card-text class="text-center">
      {{ word }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    word: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.word-card {
  background-color: #ffffff !important;  /* 添加 !important */
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.word-card:hover {
  transform: scale(1.05);
  box-shadow: 0 3px 5px rgba(0,0,0,0.2);
}
</style>
