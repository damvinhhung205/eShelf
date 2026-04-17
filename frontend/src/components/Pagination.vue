<template>
  <div class="join flex justify-center items-center gap-2 mt-6">
    <button
      class="btn btn-s join-item hover:btn-neutral"
      :disabled="currentPage === 1"
      @click="emit('update:currentPage', currentPage - 1)"
    >«</button>
    <span class="join-item">Trang {{ currentPage }} / {{ totalPages }}</span>
    <button
      class="btn btn-s join-item hover:btn-neutral"
      :disabled="currentPage === totalPages"
      @click="emit('update:currentPage', currentPage + 1)"
    >»</button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});
const emit = defineEmits(['update:currentPage']);
</script>