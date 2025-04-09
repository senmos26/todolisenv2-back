import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://nathaluz206222:nathaluz206222@cluster0.hdbk5hm.mongodb.net/todolist", {
      useNewUrlParser: true,
  
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connect;
