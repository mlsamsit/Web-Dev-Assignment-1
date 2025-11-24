import mongoose, { Schema, model } from "mongoose";
const quizSchema = new Schema({
    title: { type: String, required: true, unique: true },
    addedBy: { type: String, required: true }
});
const questionSchema = new Schema({
    quizName: { type: String, required: true },
    questions: [
        {
            question: { type: String, required: true },
            options: [{ type: String, required: true }],
            answer: { type: Number, required: true }
        }
    ]
});
const userSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, required: true, unique: true }
});
const statSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    stats: [{
            title: { type: String, required: true },
            score: { type: String, required: true },
            time: { type: String, required: true }
        }]
});
export const Users = model('users', userSchema);
export const Questions = model('questions', questionSchema);
export const Quizzes = model('quizzes', quizSchema);
export const Stats = model('stats', statSchema);
export function connectDB() {
    const url = process.env.MONGOOSE_URL;
    return mongoose.connect(url);
}
//# sourceMappingURL=db.js.map