const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UnpSchema = new Schema({
    site_name: { type: String },
    url: { type: String },
    username: { type: String },
    password: { type: String },
    info: { type: String },
    account_number: { type: String },
    security_questions: { type: String },
});

// Virtual for this book instance URL.
UnpSchema.virtual("urlToUnp").get(function () {
    return "/catalog/unps/" + this._id;
});

// Export model.
module.exports = mongoose.model("Unps", UnpSchema);
