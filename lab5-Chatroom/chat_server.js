const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const chatSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(chatSession);

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

function readUsersFromFile() {
    const usersFilePath = "./data/users.json";
    const usersFile = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(usersFile);
}

function writeUsersToFile(users) {
    const usersFilePath = "./data/users.json";
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // C. Get the JSON data from the body
    const { username, avatar, name, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const users = readUsersFromFile();
    //
    // E. Checking for the user data correctness
    //
    // Check if all required fields are not empty
    if (!username || !avatar || !name || !password) {
        return res.json({ status: "error", error: "All fields (username, avatar, name, password) are required." });
    }

    // Check if username contains only valid characters (letters, numbers, underscores)
    if (!containWordCharsOnly(username)) {
        return res.json({ status: "error", error: "Invalid username format." });
    }

    // Check if username already exists
    if (username in users) {
        return res.json({ status: "error", error: "Username already exists." });
    }

    //
    // G. Adding the new user account
    //
    const hashPassword = bcrypt.hashSync(password, 10);

    //
    // H. Saving the users.json file
    //
    users[username] = {
        avatar: avatar,
        name: name,
        password: hashPassword
    };
    writeUsersToFile(users);

    //
    // I. Sending a success response to the browser
    //
    res.json({ status: "success", user: { username, avatar, name } });
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const users = readUsersFromFile();

    //
    // E. Checking for username/password
    //
    if (!(username in users)) {
        return res.json({ status: "error", error: "Username does not exist." });
    }

    if (!bcrypt.compareSync(password, users[username].password)) {
        return res.json({ status: "error", error: "Incorrect password." });
    }

    //
    // G. Sending a success response with the user account
    //
    const { avatar, name } = users[username];
    req.session.user = { username, avatar, name };
    res.json({ status: "success", user: { username, avatar, name } });
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {

    // req.sessionStore.all((err, sessions) => {
    //     if (err) {
    //         console.error("Error fetching all sessions:", err);
    //     } else {
    //         console.log("All sessions:", sessions);
    //     }
    // });

    //
    // B. Getting req.session.user
    //
    const user = req.session.user;
    if (!user) {
        return res.json({ status: "error", error: "No active session." });
    }

    //
    // D. Sending a success response with the user account
    //
    res.json({ status: "success", user: user });
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    //
    // Deleting req.session.user
    //

    //
    // Sending a success response
    //

    // Delete when appropriate
    res.json({ status: "error", error: "This endpoint is not yet implemented." });
});


//
// ***** Please insert your Lab 6 code here *****
//


// Use a web server to listen at port 8000
app.listen(8000, () => {
    console.log("The chat server has started...");
});
