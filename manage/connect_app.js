import mongoose from "mongoose";

const connectApp = (async () => {
    try{
        await mongoose.connect(
            process.env.CONNECT_TO_MONGO_DATABASE,
        );
        console.log("✅ SERVICES is connected to MongoDB");
    } catch(error) {
        console.error("❌ %s", error);
    }
});

export default connectApp;