const mongoose =require('mongoose');


const shotUrlSchema = new mongoose.Schema({
    full:{
        type:String,
        required:true
    },
    short:{
        type:String,
        required:true,
    },
    qrCode: { 
        type: String,
        required: true,
    },
    clicks:{
        type:Number,
        required:true,
        default:0
    }
})


module.exports= mongoose.model('shortUrl',shotUrlSchema);
