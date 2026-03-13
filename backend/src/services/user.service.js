import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

class UserService {
    async create(payload) {
        const userData = {
            username: payload.username,
            firstName: payload.firstName || undefined,
            lastName: payload.lastName || undefined,
            birthDate: payload.birthDate || undefined,
            gender: payload.gender,
            address: payload.address || undefined,
            phone: payload.phone || undefined,
            role: payload.role || 'user',
        };

        Object.keys(userData).forEach(key => {
            if (userData[key] === undefined || userData[key] === null || userData[key] === "") {
                delete userData[key];
            }
        });

        userData.password = await bcrypt.hash(payload.password, 10);

        const user = new User(userData);
        return await user.save();
    }

    async find(filter) {
        return await User.find(filter);
    }

    async findById(id) {
        return await User.findById(id);
    }

    async findByName(name) {
        return await User.find({
            name: { $regex: new RegExp(name, 'i') }
        });
    }

    async findByUsername(username) {
        return await User.findOne({ username: username.toLowerCase() });
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

        const result = await User.findByIdAndUpdate(
            id, { $set: payload}, {new: true}
        );

        if(!result) {
            throw new Error("User not found");
        }

        return result;
    }

    async delete(id) {
        const result = await User.findByIdAndDelete(id);

        if (!result) {
            throw new Error(`User with id ${id} not found`);
        }

        return result;
    }

    async deleteAll() {
        const result = await User.deleteMany({});
        return result.deletedCount;
    }
}

export default UserService;