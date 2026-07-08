import fs from "fs";
const firstNames = [
  "Akash",
  "Rahul",
  "Rohit",
  "Aman",
  "Vikas",
  "Ankit",
  "Saurabh",
  "Abhishek",
  "Deepak",
  "Nitin",
  "Karan",
  "Mohit",
  "Sumit",
  "Pankaj",
  "Shubham",
  "Vivek",
  "Yash",
  "Arjun",
  "Harsh",
  "Ayush",
  "Ritik",
  "Manish",
  "Sachin",
  "Aditya",
  "Suraj",
  "Ravi",
  "Raj",
  "Lokesh",
  "Shivam",
  "Prashant",
  "Amit",
  "Varun",
  "Krishna",
  "Neeraj",
  "Tarun",
  "Hemant",
  "Gaurav",
  "Ashish",
  "Vinay",
  "Naveen",
];

const users = [];

for (let i = 1; i <= 1000; i++) {
  users.push({
    id: i,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]}_${i}`,
    age: Math.floor(Math.random() * 43) + 18, // 18-60
  });
}

fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

console.log("✅ users.json with 1000 users created.");
