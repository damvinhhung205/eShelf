import ApiClient from "./api.service";

class BookService {
    constructor(baseUrl = "/api/book") {
        this.api = ApiClient(baseUrl);
    }

    async getAllBooks() {
        return (await this.api.get("/")).data;
    }

    async createBook(data) {
        // data: { title, author, publishedYear, publisherID, price, quantity }
        return (await this.api.post("/", data)).data;
    }

    async getBook(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async updateBook(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async deleteBook(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async deleteAllBooks() {
        return (await this.api.delete("/")).data;
    }
}

export default BookService;