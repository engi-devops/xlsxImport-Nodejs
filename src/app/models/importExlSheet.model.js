import mongoose from 'mongoose';
import mongooseTimestamp from 'mongoose-timestamp';
const Schema = mongoose.Schema;

const importExlSheetSchema = new Schema({
    email: {
        type: String,
    },
    username: {
        type: String,
    },
    phone: {
        type: String,
    },
    fullname: {
        type: String,
    },
}, {
    collection: 'importExlSheet'
});

importExlSheetSchema.plugin(mongooseTimestamp);

const importExlSheetModel = mongoose.model('importExlSheet', importExlSheetSchema);

module.exports = importExlSheetModel;