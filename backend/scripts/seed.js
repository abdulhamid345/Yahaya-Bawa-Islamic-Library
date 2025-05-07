const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load models
const User = require('../models/User');
const Scholar = require('../models/Scholar');
const Category = require('../models/Category');
const Book = require('../models/Book');
const Chapter = require('../models/Chapter');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding...'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Seed data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Librarian User',
    email: 'librarian@example.com',
    password: 'librarian123',
    role: 'librarian'
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  }
];

const categories = [
  {
    name: 'Fiqh',
    description: 'Islamic jurisprudence covering various aspects of Shariah law and its application',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
    featured: true,
    bookCount: 3
  },
  {
    name: 'Aqeedah',
    description: 'Islamic theology and fundamentals of faith',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>',
    featured: true,
    bookCount: 2
  },
  {
    name: 'Tafsir',
    description: 'Quranic exegesis and interpretation by renowned scholars',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>',
    featured: true,
    bookCount: 1
  },
  {
    name: 'History',
    description: 'Islamic history and chronicles of significant events',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    featured: false,
    bookCount: 1
  }
];

const scholars = [
  {
    name: 'Sheikh Othman Bn Fodio',
    arabicName: 'الشيخ عثمان بن فوديو',
    initial: 'ع',
    era: '18th Century Scholar',
    description: 'Founder of the Sokoto Caliphate and prolific author of numerous Islamic texts',
    biography: 'Sheikh Othman Bn Fodio was a religious teacher, writer, and Islamic promoter who founded the Sokoto Caliphate in 1804. A member of the Fulani people, he was born in the Hausa city-state of Gobir, in what is now northern Nigeria. He demonstrated remarkable intellectual abilities from an early age and devoted himself to the study of the Quran, Hadith, and other Islamic texts. Throughout his life, he worked to revive Islamic practices and establish a just society based on Islamic principles.',
    specialties: ['Fiqh', 'Islamic Philosophy', 'Tafsir'],
    birthYear: 1754,
    deathYear: 1817,
    birthPlace: 'Gobir, present-day Nigeria',
    students: 237,
    activeYears: '1774-1817',
    featured: true,
    timeline: [
      {
        year: 1754,
        title: 'Birth',
        description: 'Born in Maratta, Gobir'
      },
      {
        year: 1774,
        title: 'Began Teaching',
        description: 'Started his career as a religious teacher and scholar'
      },
      {
        year: 1804,
        title: 'Founded Sokoto Caliphate',
        description: 'Established the Sokoto Caliphate through Islamic reform'
      },
      {
        year: 1817,
        title: 'Passed Away',
        description: 'Died in Sokoto, leaving a legacy of Islamic scholarship'
      }
    ]
  },
  {
    name: 'Sheikh Abdullahi Bn Fodio',
    arabicName: 'الشيخ عبد الله بن فوديو',
    initial: 'ا',
    era: '18th-19th Century Scholar',
    description: 'Renowned scholar and brother of Othman Bn Fodio, known for his comprehensive works',
    biography: 'Sheikh Abdullahi Bn Fodio was a prominent Islamic scholar, writer, and the brother of Sheikh Othman Bn Fodio. Born in Gobir, he was instrumental in the Sokoto jihad and the establishment of the Sokoto Caliphate. He was known for his extensive knowledge of Islamic sciences, particularly in jurisprudence and Arabic literature. His writings covered various aspects of Islamic knowledge, from theology to governance, and he was particularly noted for his expertise in Arabic grammar and literature.',
    specialties: ['Fiqh', 'Arabic Literature', 'Islamic Law', 'Tafsir'],
    birthYear: 1766,
    deathYear: 1829,
    birthPlace: 'Gobir, present-day Nigeria',
    students: 186,
    activeYears: '1776-1829',
    featured: true,
    timeline: [
      {
        year: 1766,
        title: 'Birth',
        description: 'Born in Gobir, present-day Northern Nigeria'
      },
      {
        year: 1776,
        title: 'Early Education',
        description: 'Began formal Islamic studies under various scholars'
      },
      {
        year: 1804,
        title: 'Sokoto Jihad',
        description: 'Participated in the jihad led by his brother Othman Bn Fodio'
      },
      {
        year: 1808,
        title: 'Scholarly Works',
        description: 'Began writing major works on Islamic jurisprudence and education'
      },
      {
        year: 1829,
        title: 'Passed Away',
        description: 'Died in Sokoto, leaving a rich legacy of Islamic scholarship'
      }
    ]
  },
  {
    name: 'Sultan Muhammad Bello',
    arabicName: 'سلطان محمد بلو',
    initial: 'م',
    era: '19th Century Scholar',
    description: 'Son of Othman Bn Fodio and second Sultan of Sokoto, authored many significant works',
    biography: 'Sultan Muhammad Bello was the second Sultan of Sokoto, succeeding his father, Sheik Othman Bn Fodio. He was a prolific writer, administrator, and military leader who consolidated and expanded the Sokoto Caliphate. Under his leadership, the caliphate became one of the largest empires in Africa. He authored numerous works on Islamic law, governance, medicine, and other subjects. His administrative skills and intellectual contributions significantly shaped the development of the region.',
    specialties: ['Islamic Philosophy', 'Fiqh', 'Tafsir', 'Medicine'],
    birthYear: 1781,
    deathYear: 1837,
    birthPlace: 'Gobir, present-day Nigeria',
    students: 175,
    activeYears: '1804-1837',
    featured: true,
    timeline: [
      {
        year: 1781,
        title: 'Birth',
        description: 'Born in Gobir to Sheikh Othman Bn Fodio'
      },
      {
        year: 1804,
        title: 'Sokoto Jihad',
        description: 'Played a key role in the jihad led by his father'
      },
      {
        year: 1817,
        title: 'Became Sultan',
        description: 'Succeeded his father as the Sultan of Sokoto'
      },
      {
        year: 1837,
        title: 'Passed Away',
        description: 'Died after leading the Sokoto Caliphate for 20 years'
      }
    ]
  }
];

// Seed function
const seedDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Scholar.deleteMany({});
    await Category.deleteMany({});
    await Book.deleteMany({});
    await Chapter.deleteMany({});
    
    console.log('Database cleared');
    
    // Create users
    const createdUsers = [];
    for (const userData of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      
      createdUsers.push(user);
    }
    
    console.log(`${createdUsers.length} users created`);
    
    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} categories created`);
    
    // Create scholars
    const createdScholars = await Scholar.insertMany(scholars);
    console.log(`${createdScholars.length} scholars created`);
    
    // Create books and chapters
    const books = [
      {
        title: 'Ihya al-Sunna',
        arabicTitle: 'إحياء السنة',
        author: 'Sheikh Othman Bn Fodio',
        scholar: createdScholars[0]._id,
        category: createdCategories[0]._id,
        language: 'Arabic',
        publishedYear: 1790,
        description: 'A comprehensive work on the revival of Prophetic traditions and their implementation in daily life.',
        featured: true,
        downloads: 1234,
        chapters: [
          {
            title: 'Introduction to the Revival of Sunnah',
            arabicTitle: 'مقدمة في إحياء السنة',
            orderNumber: 1,
            content: 'In this chapter, we explore the fundamental principles of reviving the Prophetic traditions and their significance in modern times. The author emphasizes the importance of understanding and implementing these traditions in their proper context.',
            arabicText: 'بسم الله الرحمن الرحيم. الحمد لله رب العالمين والصلاة والسلام على سيدنا محمد وعلى آله وصحبه أجمعين',
            pages: 25
          },
          {
            title: 'The Importance of Following the Sunnah',
            arabicTitle: 'أهمية اتباع السنة',
            orderNumber: 2,
            content: 'This chapter delves into why following the Sunnah is crucial for every Muslim. It discusses the relationship between the Quran and Sunnah, and how they complement each other in providing guidance.',
            arabicText: 'قال رسول الله صلى الله عليه وسلم: من أحيا سنتي فقد أحبني، ومن أحبني كان معي في الجنة',
            pages: 30
          }
        ]
      },
      {
        title: 'Diya al-Hukkam',
        arabicTitle: 'ضياء الحكام',
        author: 'Sheikh Abdullahi Bn Fodio',
        scholar: createdScholars[1]._id,
        category: createdCategories[0]._id,
        language: 'Arabic',
        publishedYear: 1810,
        description: 'A comprehensive guide on Islamic governance and leadership principles for judges and rulers.',
        featured: true,
        downloads: 756,
        chapters: [
          {
            title: 'Principles of Just Governance',
            arabicTitle: 'مبادئ الحكم العادل',
            orderNumber: 1,
            content: 'This chapter outlines the fundamental principles of just governance in Islam. It discusses the responsibilities of rulers and the rights of the ruled, emphasizing the importance of justice, consultation, and adherence to Islamic principles.',
            arabicText: 'بسم الله الرحمن الرحيم. الحمد لله رب العالمين والصلاة والسلام على سيدنا محمد وعلى آله وصحبه أجمعين',
            pages: 28
          }
        ]
      },
      {
        title: 'Diya al-Siyasat',
        arabicTitle: 'ضياء السياسات',
        author: 'Sultan Muhammad Bello',
        scholar: createdScholars[2]._id,
        category: createdCategories[3]._id,
        language: 'Arabic',
        publishedYear: 1820,
        description: 'An enlightening discourse on Islamic governance and leadership principles, focusing on practical administration.',
        featured: false,
        downloads: 890,
        chapters: [
          {
            title: 'Introduction to Islamic Governance',
            arabicTitle: 'مقدمة في الحكم الإسلامي',
            orderNumber: 1,
            content: 'This chapter introduces the concept of Islamic governance and its foundations in Quran and Sunnah. It discusses the objectives of Islamic governance and how it differs from other systems.',
            arabicText: 'بسم الله الرحمن الرحيم. الحمد لله رب العالمين والصلاة والسلام على سيدنا محمد وعلى آله وصحبه أجمعين',
            pages: 32
          }
        ]
      }
    ];
    
    for (const bookData of books) {
      const { chapters, ...book } = bookData;
      
      const createdBook = await Book.create(book);
      
      // Create chapters for this book
      if (chapters && chapters.length > 0) {
        for (const chapterData of chapters) {
          await Chapter.create({
            ...chapterData,
            book: createdBook._id
          });
        }
      }
    }
    
    console.log(`Books and chapters created`);
    
    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDB();