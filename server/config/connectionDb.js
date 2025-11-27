import mongoose from 'mongoose';

const connectDb = async()=>{
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("Connected Successfully!"))
}
export default connectDb;