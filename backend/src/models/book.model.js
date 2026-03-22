import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishedYear: {
        type: Number,
        required: true
    },
    publisherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publisher',
        required: true
    },
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);
export default Book;