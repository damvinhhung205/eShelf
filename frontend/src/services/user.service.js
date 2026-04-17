import ApiClient from "./api.service";

class UserService {
    constructor(baseUrl = "/api/user", authUrl = "/api/auth") {
        this.api = ApiClient(baseUrl);
        this.authApi = ApiClient(authUrl);
    }

    async getAllUsers() {
        return (await this.api.get("/")).data;
    }

    async getUser(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async updateUser(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async deleteUser(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async deleteAllUsers() {
        return (await this.api.delete("/")).data;
    }

    async register(data) {
        // data: { username, password, firstName, lastName, birthDate, gender, address, phone }
        return (await this.api.post("/register", data)).data;
    }

    async login(username, password) {
        const response = await this.authApi.post("/login", { username, password });
        return response.data;
    }
}

export default UserService;