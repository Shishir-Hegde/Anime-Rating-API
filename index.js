import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;
let currentUser = 0;
let users = [
    {
        id: 1,
        username: "shishir",
        password: "1234",
    }
];

let animeList = [
    {
        id: 1,
        userId: 1,
        title: "One Piece",
        rating: 9,
        episodes: 1100,
    }
];

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", (req, res) => {
    const username = req.body.username;
    if (users.findIndex((user) => user.username === username) === -1) {
        const newUser = {
            id: users.length + 1,
            username: username,
            password: req.body.password,
        };
        users.push(newUser);
        res.json({ message: "User created successfully", user: newUser });
    } else {
        res.send("User already exists");
    }
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
        res.send("User doesn't exist");
    } else {
        currentUser = users[userIndex].id;
        res.json({ message: "Successfully logged in", userId: currentUser });
    }
});

app.get("/posts", (req, res) => {
    if (currentUser) {
        const foundPosts = animeList.filter(anime => anime.userId === currentUser);
        res.json(foundPosts);
    } else {
        res.send("Not logged in");
    }
});

app.post("/posts", (req, res) => {
    if (currentUser) {
        const newAnime = {
            id: animeList.length + 1,
            userId: currentUser,
            title: req.body.title,
            rating: req.body.rating,
            episodes: req.body.episodes,
        };
        animeList.push(newAnime);
        res.json(newAnime);
    } else {
        res.send("Not logged in");
    }
});

app.patch("/posts/:id", (req, res) => {
    if (currentUser) {
        const selectedId = parseInt(req.params.id);
        const postIndex = animeList.findIndex(anime => currentUser === anime.userId && anime.id === selectedId);
        if (postIndex !== -1) {
            const updatedPost = {
                id: selectedId,
                userId: currentUser,
                title: req.body.title ? req.body.title : animeList[postIndex].title,
                rating: req.body.rating ? req.body.rating : animeList[postIndex].rating,
                episodes: req.body.episodes ? req.body.episodes : animeList[postIndex].episodes,
            };
            animeList[postIndex] = updatedPost;
            res.json(updatedPost);
        } else {
            res.send("Post not found");
        }
    } else {
        res.send("Not logged in");
    }
});

app.delete("/posts/:id", (req, res) => {
    if (currentUser) {
        const selectedId = parseInt(req.params.id);
        const postIndex = animeList.findIndex(anime => currentUser === anime.userId && anime.id === selectedId);
        if (postIndex !== -1) {
            animeList.splice(postIndex, 1);
            res.send("Deleted post successfully");
        } else {
            res.send("Post not found");
        }
    } else {
        res.send("Not logged in");
    }
});

app.get("/logout", (req, res) => {
    if (currentUser) {
        currentUser = 0;
        res.send("Logged out successfully");
    } else {
        res.send("Not logged in");
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});
