import mongoose from 'mongoose';

const borrowSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    staffID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true
    },
    bookID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'borrowing', 'rejected', 'return_pending', 'returned', 'overdue'],
        default: 'pending'
    },
},
{
    timestamps: true,
});

const Borrow = mongoose.model('Borrow', borrowSchema);
export default Borrow;