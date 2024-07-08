const fs = require("fs")

async function writeFile(file, content) {
  return new Promise((resolve, rejects) => {
    fs.writeFile(file, content, 'utf-8', (err, data) => {
      if (err) {
        rejects(err);
      } else {
        resolve(data);
      }
    });
  });
}
class Csv {
 static  csvdata(finalData) {
    let csv = '';

    const headers = [
      'User ID',
      'User Name',
      'Email ID',
      'Phone Number',
      'Theater Name',
      'Location',
      'Screen Name',
      'Seat Number',
      'Movie Title',
      'Release Date',
      'Duration',
      'Movie Slot ID',
      'Movie Start Time',
      'Movie End Time',
      'Ticket Count',
      'Booking ID',
      'Booking Status',
      'Payment ID',
      'Transaction ID',
      'Total Amount',
      'Status',
      'Payment Intent',
      'Payment Method Types',
      'Payment Status',
    ];
    csv += `${headers.join(',')}\n`;
    const values = Object.values(finalData);
    csv += `${values.join(',')}\n`;

    return csv;
  }

  static async csvreportGenerator(data) {
    try {
      await writeFile('report.csv', data);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Csv