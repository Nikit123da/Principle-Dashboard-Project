const db_connection = require("../Models/db_connection")

const insertAllStudents = (async () => {
    let connection;
    try {
        connection = await db_connection.db_connection;

        // only for development, to prevent duplicate entries
        await connection.execute('DELETE FROM students');
        await connection.execute('ALTER TABLE students AUTO_INCREMENT = 1'); // reset autoincrement (=so will start from 1 and not prev=)

        const filePath = './assets/studentsGrades.xlsx';
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // convert to json objects
        const data = XLSX.utils.sheet_to_json(sheet);

        for (const row of data) { // go through each row
            const fullName = row['שם התלמיד'] || '';
            if (!fullName) continue;

            // first & last name
            const nameParts = fullName.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ') || '';

            // class info (=in same row as student=)
            const classYear = row['שכבה'] || '';
            const classNum = row['כיתה'] || 0;

            const sql = 'INSERT INTO students (firstName, lastName, class-year, class) VALUES (?, ?, ?, ?)';

            try {
                await connection.execute(sql, [firstName, lastName, classYear, classNum]);
            } catch (insertErr) {
                console.error("failed to insert ${fullName}:, insertErr.message");
            }
        }

        console.log('all students processed successfully');
    } catch (err) {
        console.error('error:', err.message);
    } finally {
        if (connection) await connection.end();
    }
});

const getAllStudents = (async () => {
    
})

module.exports = insertAllStudents