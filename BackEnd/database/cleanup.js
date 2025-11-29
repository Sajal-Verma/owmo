import mongoose from "mongoose";

const MONGO_URL = "mongodb+srv://mv9122937:9hAuUceovOx5q8Qx@cluster0.qiqoryk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const cleanup = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const usersCollection = mongoose.connection.db.collection("users");

    // Drop old googleId index if exists
    try {
      await usersCollection.dropIndex("googleId_1");
      console.log("Dropped googleId_1 index");
    } catch (err) {
      if (err.codeName === "IndexNotFound") {
        console.log("Index googleId_1 does not exist, skipping");
      } else {
        console.error(err);
      }
    }

    // Delete documents with null googleId
    const googleResult = await usersCollection.deleteMany({ googleId: null });
    console.log("Deleted documents with null googleId:", googleResult.deletedCount);

    // Delete documents with null or missing username/name
    const nameResult = await usersCollection.deleteMany({
      $or: [{ name: null }, { name: { $exists: false } }, { username: null }, { username: { $exists: false } }],
    });
    console.log("Deleted documents with null/missing name/username:", nameResult.deletedCount);

    // Drop unique index on username if it exists
    try {
      await usersCollection.dropIndex("username_1");
      console.log("Dropped username_1 index");
    } catch (err) {
      if (err.codeName === "IndexNotFound") {
        console.log("Index username_1 does not exist, skipping");
      } else {
        console.error(err);
      }
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error(err);
  }
};

cleanup();
