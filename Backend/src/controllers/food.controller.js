const foodModel=require("../models/food.model");
const storageService=require("../services/storage.service");
const {v4:uuid}=require("uuid");

async function createFood(req, res) {
  console.log(req.foodPartner);
  console.log(req.body);
  console.log("file", req.file);

  const fileUploadResult = await storageService.uploadFile(
    req.file.buffer,
    uuid()
  );

  const footItem = await foodModel.create({
    name: req.body.name,
    description: req.body.description,
    video: fileUploadResult.url,
    foodPartner: req.foodPartner._id   // FIXED ✔ CORRECT FIELD
  });

  res.status(201).json({
    message: "food created successfully",
    food: footItem
  });
}


async function getFoodItems(req,res){
const foodItems=await foodModel.find({}).populate("foodPartner");;
res.status(200).json({
    message:"Food items fetched successfully",
    foodItems:foodItems
})

}

module.exports={
    createFood
,getFoodItems
}