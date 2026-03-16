import Staff from '../models/staff.model.js';
import bcrypt from 'bcrypt';

class StaffService {
    async create(payload) {
        const staffData = {
            username: payload.username,
            fullName: payload.fullName || undefined,
            address: payload.address || undefined,
            phone: payload.phone || undefined,
            role: payload.role || 'staff',
        }

        Object.keys(staffData).forEach(key => {
            if (staffData[key] === undefined || staffData[key] === null || staffData[key] === "") {
                delete staffData[key];
            }
        });

        staffData.password = await bcrypt.hash(payload.paddword, 20);

        const staff = new Staff(staffData);
        return await staff.save();
    }

    async find(filter) {
        return await Staff.find(filter);
    }

    async findById(id) {
        return await Staff.findById(id);
    }

    async findByName(name) {
        return await Staff.find({
            name: { $regex: new RegExp(name, 'i') }
        });
    }

    async findByUsername(username) {
        return await Staff.findOne({ username: username.toLowerCase() });
    }

    async update(id, payload) {
        if (payload.password) {
            payload.password = await bcrypt.hash(payload.password, 10);
        } else {
            delete payload.password;
        }

        Object.keys(payload).forEach(key => {
            if (payload[key] === undefined || payload[key] === null || payload[key] === "") {
                delete payload[key];
            }
        });

        const result = await Staff.findByIdAndUpdate(
            id, { $set: payload}, {new: true, runValidators: true}
        );

        if(!result) {
            throw new Error("Staff not found");
        }

        return result;
    }

    async delete(id) {
        const result = await Staff.findByIdAndDelete(id);

        if (!result) {
            throw new Error(`Staff with id ${id} not found`);
        }

        return result;
    }

    async deleteAll() {
        const result = await Staff.deleteMany({});
        return result.deletedCount;
    }
}

export default StaffService;