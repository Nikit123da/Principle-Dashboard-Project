const {db_connection} = require("../Models/db_connection")
const XLSX = require("xlsx");
const insertAllStudents = async () => {
    let connection;
    try {
        connection = await db_connection;

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

            const sql = 'INSERT INTO students (firstName, lastName, class_year, class) VALUES (?, ?, ?, ?)';

            try {
                await connection.execute(sql, [firstName, lastName, classYear, classNum]);
            } catch (insertErr) {
                console.error("failed to insert ${fullName}:, insertErr.message");
            }
        }

        console.log('all students processed successfully');
    } catch (err) {
        console.error('error: SU', err.message);
    } finally {
        // if (connection) await connection.end();
    }
};
const insertAllteachers = async () => { 
    let connection;
    try {
        connection = await db_connection.db_connection;

        // only for development, to prevent duplicate entries
        await connection.execute('DELETE FROM teachers');
        await connection.execute('ALTER TABLE teachers AUTO_INCREMENT = 1'); // reset autoincrement (=so will start from 1 and not prev=)

        const filePath = './assets/studentsGrades.xlsx';
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // convert to json objects
       const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
       const headers = rows[0]; // השורה הראשונה = כותרות העמודות


      
        for (const colNameRaw of headers) {
              const colName = String(colNameRaw || "").trim();
              if (!colName) continue;
            
              if (["מס'", "ת.ז", "שם התלמיד", "שכבה", "כיתה"].includes(colName)) continue;

                const parts = colName.split("-"); // עובד גם אם יש/אין רווחים
                if (parts.length < 2) continue;

                const subject = parts[0].trim(); // אם תרצה להשתמש בזה בהמשך
                const fullName = parts.slice(1).join("-").trim(); // למקרה שיש מקפים נוספים בשם

                if (!fullName) continue;

                const nameParts = fullName.split(/\s+/);
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(" ") || "";

            const sql = 'INSERT INTO teachers (firstName, lastName) VALUES (?, ?)';
              try {
                await connection.execute(sql, [firstName, lastName]);
            } catch (insertErr) {
                console.error("failed to insert ${fullName}:, insertErr.message");
                console.log({insertErr});
            }
        }

   console.log('all teachers processed successfully');
    } catch (err) {
        console.error('error: ', err.message);
    } finally {
        // if (connection) await connection.end();
    }
};

module.exports = {insertAllStudents,insertAllteachers}