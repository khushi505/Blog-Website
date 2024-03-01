const express = require('express');
const router = express.Router();
const Post =  require('../models/Post');

router.get('/',async (req,res)=>{
  

    try{

        const locals ={
            title: "NodeJs Blog",
            description: "Simple Blog created with NodeJS, Express & MongoDb."
        }

        let perPage = 10;
        let page = req.query.page || 1; //degault page - 1


        const data = await Post.aggregate([ {$sort: {createdAt:  -1}}]) //oldest will be at the top
        .skip(perPage * page - perPage) //skip a page
        .limit(perPage)
        .exec(); //executes aggregate

        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);




        res.render('index',{
            locals, 
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });
    }catch(error){
        console.log(error);
    }
    
    
});






// function insertPostData (){
//     Post.insertMany([
        
//             {
//                 "title": "Tech Trends in 2024",
//                 "body": "Exploring the latest advancements and forecasts in technology for the year 2024."
//             },
//             {
//                 "title": "The Art of Coding",
//                 "body": "Delving into the creative process behind programming and software development."
//             },
//             {
//                 "title": "Healthy Living Tips",
//                 "body": "Discover practical advice and strategies for maintaining a healthy lifestyle."
//             },
//             {
//                 "title": "Exploring Space Exploration",
//                 "body": "A deep dive into the future of space travel and humanity's quest to explore the cosmos."
//             },
//             {
//                 "title": "Mastering Productivity Hacks",
//                 "body": "Unlocking the secrets to boosting efficiency and achieving more in less time."
//             },
//             {
//                 "title": "The Evolution of Artificial Intelligence",
//                 "body": "Tracing the history and future trajectory of AI technology and its impact on society."
//             },
//             {
//                 "title": "Travel Adventures Around the World",
//                 "body": "Embark on a journey through captivating destinations and cultural experiences."
//             },
//             {
//                 "title": "Financial Planning Strategies",
//                 "body": "Learn effective methods for managing finances and securing a stable financial future."
//             },
//             {
//                 "title": "Innovations in Sustainable Energy",
//                 "body": "Exploring groundbreaking developments in renewable energy and environmental sustainability."
//             },
//             {
//                 "title": "Unraveling the Mysteries of Quantum Physics",
//                 "body": "Dive into the mind-bending world of quantum mechanics and its implications for science."
//             },
//             {
//                 "title": "Mindfulness Meditation Techniques",
//                 "body": "Discover mindfulness practices for reducing stress, enhancing focus, and promoting well-being."
//             },
//             {
//                 "title": "Artificial Intelligence in Healthcare",
//                 "body": "Exploring how AI is revolutionizing the healthcare industry and improving patient outcomes."
//             },
//             {
//                 "title": "Culinary Adventures: Global Cuisine",
//                 "body": "Savor the flavors of diverse cuisines from around the world and expand your culinary horizons."
//             },
//             {
//                 "title": "The Future of Work: Remote Revolution",
//                 "body": "Examining the rise of remote work and its implications for the future of employment."
//             },
//             {
//                 "title": "Exploring Ancient Civilizations",
//                 "body": "Journey back in time to uncover the mysteries of ancient cultures and civilizations."
//             },
//             {
//                 "title": "Investing in the Stock Market: Beginner's Guide",
//                 "body": "Learn the basics of stock market investing and how to build a successful investment portfolio."
//             },
//             {
//                 "title": "Art and Creativity: Inspiration Unleashed",
//                 "body": "Explore the transformative power of art and creativity in expressing the human experience."
//             },
//             {
//                 "title": "The Science of Happiness",
//                 "body": "Discover the latest research and practices for cultivating happiness and well-being in daily life."
//             },
//             {
//                 "title": "Digital Marketing Strategies for Success",
//                 "body": "Unlock effective techniques and trends in digital marketing to grow your online presence."
//             },
//             {
//                 "title": "Climate Change: Challenges and Solutions",
//                 "body": "Examining the urgent need for action on climate change and exploring potential solutions for a sustainable future."
//             },
             
//     ])
// }

// insertPostData();


/*
GET 
HOME
 */

router.get('/post/:id',async (req,res)=>{


    try{


        let slug = req.params.id; //to grab the id 

        const data = await Post.findById({ _id:slug});

        const locals ={
            title: data.title,
            description: "Simple Blog created with NodeJS, Express & MongoDb."
        }

        res.render('post',{locals, data});
    }catch(error){
        console.log(error);
    }
    
    
});

router.get('/about',(req,res)=>{
    res.render('about');
});

/*
Post 
post - searchBar
 */

router.post('/search',async (req,res)=>{


    try{

        const locals ={
            title: "Search",
            description: "Simple Blog created with NodeJS, Express & MongoDb."
        }

        let searchTerm = req.body["searchTerm"];

        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")

        const data = await Post.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
            ]
        });

        // console.log(searchTerm);

        res.render("search",{
            data,
            locals
        });
        
    }catch(error){
        console.log(error);
    }
    
    
});


module.exports = router;
