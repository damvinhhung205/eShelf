import Book from "../models/book.model.js";

class BookService {
    async create(payload) {
        try {
            const book = new Book({
                title: payload.title,
                price: payload.price,
                quantity: payload.quantity,
                publishedYear: payload.publishedYear,
                publisher: payload.publisher,
                author: payload.author,
            });

            Object.keys(book).forEach(key => {
                if (book[key] === undefined) {
                    delete book[key];
                }
            });

            return await book.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async find(filter) {
        return await Book.find(filter).populate("publisher");
    }

    async findById(id) {
        return await Book.findOne({ _id: id }).populate("publisher");
    }

    async findByName(name) {
        return await Book.find({
            name: { $regex: name, $options: "i" }
        });
    }

    async update(id, payload) {
        Object.keys(payload).forEach(key => {
            if (payload[key] === undefined || payload[key] === "" || payload[key] === null) {
                delete payload[key];
            }
        });

        const result = await Book.findByIdAndUpdate(
            id, { $set: payload }, { new: true, runValidators: true }
        );
        return result;
    }

    async delete(id) {
        const result = await Book.findByIdAndDelete(id);
        return result;
    }

    async deleteAll() {
        const result = await Book.deleteMany({});
        return result.deletedCount;
    }
}

export default BookService;