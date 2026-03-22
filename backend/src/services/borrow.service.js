import Borrow from "../models/borrow.model.js";

class BorrowService {
    async create(payload) {
        try {
            const borrow = new Borrow({
                userID: payload.userID,
                bookID: payload.bookID,
                borrowDate: payload.borrowDate || new Date(),
                returnDate: payload.returnDate || null,
                status: payload.status || "pending"
            });

            Object.keys(borrow).forEach(key => {
                if (borrow[key] === undefined || borrow[key] === null || borrow[key] === "") {
                    delete borrow[key];
                }
            });

            return await borrow.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async find(filter) {
        return await Borrow.find(filter)
            .populate("userID")
            .populate({
                path: "bookID",
                populate: {
                    path: "publisherID",
                    model: "Publisher"
                }
            }).populate({
                path: "staffID",
                model: "Staff"
            });

    }

    async findById(id) {
        return await Borrow.findById(id)
            .populate("userID")
            .populate({
                path: "bookID",
                populate: {
                    path: "publisherID",
                    model: "Publisher"
                }
            }).populate({
                path: "staffID",
                model: "Staff"
            });
    }

    async findByUserId(userID) {
        return await Borrow.find({ userID: userID });
    }

    async update(id, payload) {
        Object.keys(payload).forEach(key => {
            if (payload[key] === undefined || payload[key] === "" || payload[key] === null) {
                delete payload[key];
            }
        });

        const result = await Borrow.findByIdAndUpdate(
            id,
            { $set: payload },
            {
                new: true,
                runValidators: true
            }
        )
        return result;
    }

    async delete(id) {
        const result = await Borrow.findByIdAndDelete(id);
        return result;
    }

    async deleteAll() {
        const result = await Borrow.deleteMany({});
        return result.deletedCount;
    }
}

export default BorrowService;