// ================================================================
// ES TEH IBUKOTA - Google Apps Script
// Hubungkan website ke Google Spreadsheet
// ================================================================

// ID Spreadsheet kamu — ambil dari URL spreadsheet:
// https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
const SPREADSHEET_ID = '1W2ezxAArXIvSiHPvuqpUwDMOGdb5rjFOO-Ozn3Gs8S4';

// Nama sheet
const SHEET_PESANAN = 'Pesanan';
const SHEET_PRODUK  = 'Produk';

// ----------------------------------------------------------------
// ENTRY POINT — semua request masuk ke sini
// ----------------------------------------------------------------
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.action === 'saveOrder') {
      return saveOrder(data);
    }

    return response({ status: 'error', message: 'Action tidak dikenal' });
  } catch (err) {
    return response({ status: 'error', message: err.toString() });
  }
}

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getProducts') {
    return getProducts();
  }

  return response({ status: 'error', message: 'Action tidak dikenal' });
}

// ----------------------------------------------------------------
// SIMPAN PESANAN ke sheet "Pesanan"
// ----------------------------------------------------------------
function saveOrder(data) {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_PESANAN);

  // Buat header jika sheet masih kosong
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'No', 'Tanggal', 'Nama', 'No. Telepon',
      'Alamat', 'Item Pesanan', 'Metode Bayar', 'Total', 'Status'
    ]);
    // Format header
    const header = sheet.getRange(1, 1, 1, 9);
    header.setBackground('#0d3320');
    header.setFontColor('#ffffff');
    header.setFontWeight('bold');
  }

  const no     = sheet.getLastRow(); // nomor urut otomatis
  const tanggal = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  sheet.appendRow([
    no,
    tanggal,
    data.name    || '-',
    data.phone   || '-',
    data.address || '-',
    data.items   || '-',
    data.payment || '-',
    data.total   || 0,
    'Menunggu Konfirmasi'
  ]);

  // Format kolom Total sebagai mata uang
  const lastRow  = sheet.getLastRow();
  const totalCol = sheet.getRange(lastRow, 8);
  totalCol.setNumberFormat('"Rp "#,##0');

  return response({ status: 'success', message: 'Pesanan berhasil disimpan' });
}

// ----------------------------------------------------------------
// AMBIL PRODUK dari sheet "Produk"
// ----------------------------------------------------------------
function getProducts() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_PRODUK);

  if (!sheet || sheet.getLastRow() <= 1) {
    // Kembalikan array kosong jika sheet belum ada data
    return response({ status: 'success', products: [] });
  }

  const rows     = sheet.getDataRange().getValues();
  const headers  = rows[0]; // baris pertama = header
  const products = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0]) continue; // skip baris kosong

    products.push({
      id:          String(row[0]),
      name:        row[1] || '',
      price:       Number(row[2]) || 0,
      category:    row[3] || '',
      description: row[4] || '',
      image:       row[5] || '',
    });
  }

  return response({ status: 'success', products });
}

// ----------------------------------------------------------------
// HELPER: bungkus response dengan CORS header
// ----------------------------------------------------------------
function response(data) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
