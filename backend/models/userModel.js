import mongoose from 'mongoose';

const Schema=mongoose.Schema;
const userSchema=new mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true},
        task:
           [{type:Schema.Types.ObjectId, ref:'Task'}]
           ,
        isAdmin:{type:Boolean,default:false,required:true},
       
    },
    {
        timestamps:true
    }
);

const User=mongoose.model('User',userSchema);
export default User;