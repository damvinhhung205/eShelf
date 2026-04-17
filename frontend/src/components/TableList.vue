<script setup>
defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  actions: { type: Boolean, default: false },
  hideDefaultActions: { type: Boolean, default: false },
});
const emit = defineEmits(["edit", "delete"]);

const handleEdit = (item) => emit("edit", item);
const handleDelete = (item) => emit("delete", item);
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" class="text-center">
            {{ col.label }}
          </th>
          <th v-if="actions" class="text-center">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item._id">
          <td v-for="col in columns" :key="col.key" class="text-center">
            <slot :name="col.key" :row="item">
              <template v-if="col.type === 'date'">
                {{
                  item[col.key]
                    ? new Date(item[col.key]).toLocaleDateString("vi-VN")
                    : "N/A"
                }}
              </template>
              <template v-else-if="col.type === 'currency'">
                {{ item[col.key]?.toLocaleString() }}đ
              </template>
              <template v-else-if="col.type === 'gender'">
                {{
                  item[col.key] === "Male"
                    ? "Nam"
                    : item[col.key] === "Female"
                      ? "Nữ"
                      : "N/A"
                }}
              </template>
              <template v-else-if="col.type === 'object'">
                {{ item[col.key]?.[col.field] || "N/A" }}
              </template>
              <template v-else>
                {{ item[col.key] || "N/A" }}
              </template>
            </slot>
          </td>
          <td v-if="actions" class="flex justify-around text-center">
            <slot name="actions" :row="item">
              <div v-if="!hideDefaultActions" class="flex gap-5">
                <button @click="handleEdit(item)" class="btn btn-sm btn-info">
                  Sửa
                </button>
                <button
                  @click="handleDelete(item)"
                  class="btn btn-sm btn-error"
                >
                  Xóa
                </button>
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
