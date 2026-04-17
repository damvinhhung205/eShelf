import ApiClient from "./api.service";

class StaffService {
    constructor(baseUrl = "/api/staff", authUrl = "/api/auth") {
        this.api = ApiClient(baseUrl);
        this.authApi = ApiClient(authUrl);
    }

    async getAllStaffs() {
        return (await this.api.get("/")).data;
    }

    async getStaff(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async createStaff(data) {
        // data: { username, password, fullName, address, phone }
        return (await this.api.post("/", data)).data;
    }

    async updateStaff(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async deleteStaff(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async deleteAllStaffs() {
        return (await this.api.delete("/")).data;
    }

    async login(username, password) {
        const response = await this.authApi.post("/login", { username, password });
        return response.data;
    }
}

export default StaffService;