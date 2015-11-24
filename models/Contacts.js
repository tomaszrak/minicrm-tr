/**
 * Created by Tomek on 2015-10-17.
 */
var mongoose = require('mongoose');

var ContactSchema = new mongoose.Schema({
    company_name:String,
    name :{type:  String, required: true},
    surname:String,
    address: {type:  String, required: true},
    pesel: String,
    phone: String,
    email: String,
    tax_id_number: String,
    desc: String

 });
mongoose.model('Contact', ContactSchema);