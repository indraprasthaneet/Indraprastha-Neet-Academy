const fs = require('fs');

// Read the file
let content = fs.readFileSync('./controllers/noteController.backup.js', 'utf8');

// Fix the corrupted regex patterns by directly replacing the problematic sections
// We need to match the exact corrupted patterns and replace them with correct ones

// First pattern - Remove excessive whitespace
content = content.replace(/\s*
\s*\s*\s*\/g, '

'\);/g, "    extractedText = extractedText.replace(/\n\\s*\n\\s*/g, '\n\n');");

// Second pattern - Normalize line endings  
content = content.replace(/\s*\/g, '\n'\);/g, "    extractedText = extractedText.replace(/\\r/g, '\\n');");

// Third pattern - Preserve paragraph breaks (same as first)
content = content.replace(/\s*
\s*\s*\s*\/g, '

'\);/g, "    extractedText = extractedText.replace(/\n\\s*\n\\s*/g, '\n\n');");

// Write the fixed content back to the file
fs.writeFileSync('./controllers/noteController.backup.js', content);

console.log('Regex patterns fixed successfully!');