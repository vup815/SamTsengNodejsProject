const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MemberSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100,
    },
    email: {
        type: String,
        match: /(([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)(\s*;\s*|\s*$))*/,
        requied: true,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        maxlength: 100
    },
    picture: {
        type: String
    }
});
const Member = mongoose.model('Member', MemberSchema)
module.exports = Member;