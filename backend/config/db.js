import mongoose from 'mongoose'

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://sibersuper1122_db_user:shreyanshnancy8032180321@cluster0.40bqant.mongodb.net/GroceryBasket"
    )
    .then(() => console.log("DB Connected"));

}
