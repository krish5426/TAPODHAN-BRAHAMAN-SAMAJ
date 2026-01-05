const mongoose = require("mongoose");
const Profile = require("./models/profile");

mongoose.connect("mongodb://127.0.0.1:27017/mydatabase")
    .then(async () => {
        console.log("Connected. Fixing data...");

        // 1. Fix missing status -> approved
        const res1 = await Profile.updateMany(
            { status: { $exists: false } },
            { $set: { status: 'approved' } }
        );
        console.log(`Updated missing status: ${res1.modifiedCount}`);

        // 2. Fix 'undefined' string status if any (bad imports)
        const res2 = await Profile.updateMany(
            { status: 'undefined' },
            { $set: { status: 'approved' } }
        );
        console.log(`Updated 'undefined' status: ${res2.modifiedCount}`);

        // 3. Trim genders (optional, better to just handle in query, but good to clean)
        // We can't easy trim in updateMany without aggregation pipeline, 
        // so we'll just rely on the API regex update for whitespaces.

        console.log("Data fix complete.");
        process.exit();
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });
