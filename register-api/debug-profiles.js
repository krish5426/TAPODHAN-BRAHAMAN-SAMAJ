const mongoose = require("mongoose");
const Profile = require("./models/profile");

mongoose.connect("mongodb://127.0.0.1:27017/mydatabase")
    .then(async () => {
        console.log("Connected to DB");

        const all = await Profile.find({});
        console.log(`Total Profiles: ${all.length}`);

        const approved = await Profile.find({ status: 'approved' });
        console.log(`Approved Profiles: ${approved.length}`);

        const pending = await Profile.find({ status: 'pending' });
        console.log(`Pending Profiles: ${pending.length}`);

        const males = await Profile.find({ gender: /male/i });
        console.log(`Gender ~Male: ${males.length}`);

        const females = await Profile.find({ gender: /female/i });
        console.log(`Gender ~Female: ${females.length}`);

        if (all.length > 0) {
            console.log("Sample Profile Status:", all[0].status);
            console.log("Sample Profile Gender:", all[0].gender);
        }

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
