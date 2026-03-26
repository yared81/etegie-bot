const Database = require('better-sqlite3');
const path = require('path');

// 1. Define the database file path
const dbPath = path.resolve(__dirname, 'etegie.db');

// 2. Connect to the database (it creates the file if it doesn't exist)
const db = new Database(dbPath, { verbose: console.log });

/**
 * Step 2: Initialize Tables and Columns
 */
function initDatabase() {
    // 3. Create the FAQs table
    db.exec(`
        CREATE TABLE IF NOT EXISTS faqs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            keywords TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // 4. Seed initial data if table is empty
    const checkTable = db.prepare('SELECT count(*) as count FROM faqs').get();
    
    if (checkTable.count === 0) {
        const insert = db.prepare('INSERT INTO faqs (question, answer, keywords) VALUES (?, ?, ?)');
        
        insert.run(
            'What is Etegie Bot?', 
            'Etegie Bot is a professional chatbot system for modern websites.', 
            'etegie, bot, what'
        );
        
        insert.run(
            'How to migrate to nodejs?', 
            'You just set up this Express server and point your apiUrl to it!', 
            'migrate, nodejs, server'
        );
        
        console.log('✅ Database initialized and seeded with 2 FAQs.');
    } else {
        console.log('ℹ️ Database already exists with ' + checkTable.count + ' records.');
    }
}

// Execute initialization
initDatabase();

module.exports = db;
