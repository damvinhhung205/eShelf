<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
    staff: {
        type: Object,
        required: true
    }
});

const goToEditStaff = (staffID) => {
    router.push({ name: "staffprofile.edit", params: { id: staffID } });
};
</script>

<template>
    <div
        class="flex flex-wrap flex-col shadow rounded-lg overflow-hidden hover:shadow-lg hover:scale-[1.001] transition">
        <div class="flow-root">
            <dl class="divide-y divide-gray-200 rounded border border-gray-200 text-sm">
                <div class="grid grid-cols-2 p-2">
                    <dt class="font-bold text-gray-900">Họ và Tên</dt>

                    <dd class="text-gray-800 sm:col-span-2 truncate">{{ staff.fullName || "Không xác định" }}</dd>
                </div>

                <div class="grid grid-cols-2 p-2">
                    <dt class="font-bold text-gray-900">Tên đăng nhập</dt>

                    <dd class="text-gray-800 sm:col-span-2 truncate">{{ staff.username || "Không xác định" }}</dd>
                </div>

                <div class="grid grid-cols-2 p-2">
                    <dt class="font-bold text-gray-900">Địa chỉ</dt>

                    <dd class="text-gray-800 sm:col-span-2 truncate">{{ staff.address || "Không xác định" }}</dd>
                </div>

                <div class="grid grid-cols-2 p-2">
                    <dt class="font-bold text-gray-900">Số điện thoại</dt>

                    <dd class="text-gray-800 sm:col-span-2 truncate">{{ staff.phone || "Không xác định" }}</dd>
                </div>
                <div class="grid grid-cols-1">
                    <button @click=" goToEditStaff( props.staff._id )"
                        class="btn btn-ghost text-base hover:underline hover:btn-info hover:text-white">Chỉnh
                        sửa</button>
                </div>
            </dl>
        </div>

    </div>
</template>