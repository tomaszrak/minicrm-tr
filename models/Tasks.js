var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
    name :{type:  String, required: true},
    time_limit:{type: Date},
    created_at: { type: Date,
        default: Date.now},
    desc: String,
    assigned_contact:  String,
    assigned_employee:  String,
    status: { type: String,
        default: 'nowe'
    }

});
mongoose.model('Task', TaskSchema);
