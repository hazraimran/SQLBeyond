const { MongoClient, ServerApiVersion, Logger } = require("mongodb");

// Enable debugging
// Logger.setLevel("debug");

// Corrected MongoDB URI
const uri =
  "mongodb+srv://singhmanraj8:Q9sxmSs0pf2KJERx@cluster0.k8n69.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB!");

    // Test database ping
    await client.db("admin").command({ ping: 1 });
    console.log("Ping successful! MongoDB is connected.");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  } finally {
    await client.close();
  }
}

run();
