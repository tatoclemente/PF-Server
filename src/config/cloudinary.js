const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const{CLOUD_NAME,CLOUD_KEY,API_SECRET,CLOUD_FOLDER}= process.env;

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key:CLOUD_KEY,
    api_secret:API_SECRET
});


const uploadImage = async (filePath)=>{
    return await cloudinary.uploader.upload(filePath,{
        folder: CLOUD_FOLDER,
    })
}


module.exports= uploadImage;