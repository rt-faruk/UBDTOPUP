// Ekhane category ar package gulo bodlan. Dam gulo namuna, apnar nijer dam boshan.
//
// CHOBI: prottek category/package e "image" field ache.
//   image: ""                  -> built-in icon dekhabe
//   image: "images/ff.png"     -> apnar nijer chobi dekhabe (images folder e rakhun)
// "icon" holo built-in icon er naam: ff, pubg, diamond, uc, member, pass, like
const SHOP = {
  name: "UBD TOPUP",
  whatsapp: "8801XXXXXXXXX",   // country code shoho, + chara
  telegram: "https://t.me/yourchannel",
  payNumbers: {
    bKash: "01XXXXXXXXX",
    Nagad: "01XXXXXXXXX",
    Rocket: "01XXXXXXXXX"
  }
};

const CATEGORIES = [
  {
    id: "ff-uid",
    icon: "ff", image: "",
    title: "Free Fire UID Top Up",
    note: "শুধু প্লেয়ার UID দিন, পাসওয়ার্ড লাগবে না।",
    packages: [
      { id: "ff25", icon: "diamond", image: "",   name: "25 Diamonds",   price: 22 },
      { id: "ff115", icon: "diamond", image: "",  name: "115 Diamonds",  price: 85 },
      { id: "ff240", icon: "diamond", image: "",  name: "240 Diamonds",  price: 160 },
      { id: "ff355", icon: "diamond", image: "",  name: "355 Diamonds",  price: 240 },
      { id: "ff610", icon: "diamond", image: "",  name: "610 Diamonds",  price: 400 },
      { id: "ff1240", icon: "diamond", image: "", name: "1240 Diamonds", price: 790 }
    ]
  },
  {
    id: "ff-member",
    icon: "ff", image: "",
    title: "Free Fire Weekly / Monthly",
    note: "সাপ্তাহিক ও মাসিক মেম্বারশিপ।",
    packages: [
      { id: "weekly", icon: "member", image: "",  name: "Weekly",  price: 155 },
      { id: "monthly", icon: "member", image: "", name: "Monthly", price: 770 }
    ]
  },
  {
    id: "ff-levelup",
    icon: "ff", image: "",
    title: "Free Fire Level Up Pass",
    note: "লেভেল আপ পাস অর্ডার করুন।",
    packages: [
      { id: "lv1", icon: "pass", image: "", name: "Level Up Pass", price: 150 }
    ]
  },
  {
    id: "ff-like",
    icon: "ff", image: "",
    title: "Free Fire Likes",
    note: "প্রোফাইল লাইক।",
    packages: [
      { id: "l100", icon: "like", image: "", name: "100 Likes", price: 12 },
      { id: "l200", icon: "like", image: "", name: "200 Likes", price: 22 }
    ]
  },
  {
    id: "pubg-uc",
    icon: "pubg", image: "",
    title: "PUBG UC Top Up",
    note: "PUBG Mobile প্লেয়ার ID দিন।",
    packages: [
      { id: "uc60", icon: "uc", image: "",   name: "60 UC",   price: 85 },
      { id: "uc325", icon: "uc", image: "",  name: "325 UC",  price: 420 },
      { id: "uc660", icon: "uc", image: "",  name: "660 UC",  price: 840 },
      { id: "uc1800", icon: "uc", image: "", name: "1800 UC", price: 2050 },
      { id: "uc3850", icon: "uc", image: "", name: "3850 UC", price: 4200 }
    ]
  }
];
