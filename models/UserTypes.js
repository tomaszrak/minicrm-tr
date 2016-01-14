/**
 * Created by Tomek on 2016-01-04.
 */
var mongoose = require('mongoose');

var UserTypeSchema = new mongoose.Schema({
    name:{type:  String, required: true},
    desc: {type:  String, required: true},
});
mongoose.model('UserTypes', UserTypeSchema);