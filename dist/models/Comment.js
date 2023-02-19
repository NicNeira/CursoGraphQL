import { Schema, model } from 'mongoose';
const commentSchema = new Schema({
    name: String,
    endDate: String
});
export default model('Comment', commentSchema);
