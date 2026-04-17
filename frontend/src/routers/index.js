import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../services/auth.service.js";

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/Home.vue")
    },
    {
        path: "/auth/login",
        name: "auth.login",
        component: () => import("../views/Login.vue")
    },
    {
        path: "/user/register",
        name: "user.register",
        component: () => import("../views/UserRegister.vue")
    },
    {
        path: "/userprofile",
        name: "userprofile",
        component: () => import("../views/UserProfile.vue"),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: "/user/add",
        name: "user.add",
        component: () => import("../views/UserAdd.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/userprofile/edit/:id",
        name: "userprofile.edit",
        component: () => import("../views/UserProfileEdit.vue"),
        meta: {
            requiresAuth: true
        },
        props: true
    },
    {
        path: "/books",
        name: "book.list",
        component: () => import("../views/BookList.vue"),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: "/users",
        name: "user.list",
        component: () => import("../views/UserList.vue"),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: "/book/add",
        name: "book.add",
        component: () => import("../views/BookAdd.vue"),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: "/book/edit/:id",
        name: "book.edit",
        component: () => import("../views/BookEdit.vue"),
        meta: {
            requiresAuth: true
        },
        props: true
    },
    {
        path: "/borrow/add/:id",
        name: "borrow.add",
        component: () => import("../views/BorrowAdd.vue"),
        props: true,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: "/borrow/edit/:id",
        name: "borrow.edit",
        component: () => (import("../views/BorrowEdit.vue")),
        props: true,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/staffs",
        name: "staff.list",
        component: () => import("../views/StaffList.vue"),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: "/staffprofile",
        name: "staff.profile",
        component: () => import("../views/StaffProfile.vue"),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: "/staff/add",
        name: "staff.add",
        component: () => import("../views/StaffAdd.vue"),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: "/staff/edit/:id",
        name: "staffprofile.edit",
        component: () => import("../views/StaffProfileEdit.vue"),
        meta: {
            requiresAuth: true
        },
        props: true
    },
    {
        path: "/publishers",
        name: "publisher.list",
        component: () => import("../views/PublisherList.vue"),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: "/publisher/add",
        name: "publisher.add",
        component: () => import("../views/PublisherAdd.vue"),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: "/publisher/edit/:id",
        name: "publisher.edit",
        component: () => import("../views/PublisherEdit.vue"),
        meta: {
            requiresAuth: true
        },
        props: true
    },
    {
        path: "/borrowpending",
        name: "borrow.pending",
        component: () => import("../views/BorrowPending.vue"),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: "/borrowcheck",
        name: "borrow.check",
        component: () => import("../views/BorrowCheck.vue"),
        meta: {
            requiresAuth: true
        },
    },
    {
        path: "/auth/google/callback",
        name: "auth.google.callback",
        component: () => import("../views/GoogleCallback.vue"),
        meta: { requiresAuth: false }
    },
    {
        path: '/:pathMatch(.*)*',
        name: "notfound",
        component: () => import("../views/NotFound.vue")
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        return "/auth/login";
    }
    return true;
});

export default router;