const { User } = require('./mysql-models');

async function testMobileLookup() {
    try {
        const mobile = "9898776654";
        console.log(`Looking up user by mobile: ${mobile}`);
        const user = await User.findByMobile(mobile);
        
        if (user) {
            console.log("User found:");
            console.log({
                id: user.id,
                email: user.email,
                mobile: user.mobile,
                firstName: user.firstName
            });
        } else {
            console.log("User not found!");
        }
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}

testMobileLookup();
