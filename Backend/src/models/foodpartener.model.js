const mongoose=require('mongoose');

const foodPartnerSchema=new mongoose.Schema({
    RestaurantName:{
        type:String,
        required:true
    },
    contactName:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true     

    },
    password:{
        type:String,
        required:true  
    }
})

const foodPartnerModel=mongoose.model("foodPartner",foodPartnerSchema);
module.exports=foodPartnerModel;