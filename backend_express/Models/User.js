const mongoose=require('mongoose');
// console.log(mongoose);
const {schema}=mongoose;

const Userschema={
    name:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required: true
    }, 
    password:{
        type: String,
        required: true
    },
    newsletter:{
        type: Boolean,
        required: false
    }
}
module.exports=mongoose.model('user',Userschema);