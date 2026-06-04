# Cara Menghubungkan Website ke Google Spreadsheet

## Langkah 1 — Buat Google Spreadsheet

1. Buka https://sheets.google.com
2. Buat spreadsheet baru, beri nama **"Es Teh Ibukota - Database"**
3. Buat **2 sheet** (tab di bawah):
   - Sheet pertama: ganti nama jadi **`Pesanan`**
   - Sheet kedua: ganti nama jadi **`Produk`**

4. Salin **ID Spreadsheet** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/INI_ADALAH_ID_NYA/edit
   ```

---

## Langkah 2 — Isi Sheet Produk (opsional)

Jika ingin produk diambil dari spreadsheet (bukan dari `app.js`),
isi sheet **Produk** dengan format berikut:

| id  | name             | price | category        | description          | image       |
|-----|------------------|-------|-----------------|----------------------|-------------|
| t1  | Es Teh Original  | 5000  | Tea Series      | Teh hitam segar...   | (url gambar)|
| m1  | Milk Tea Original| 12000 | Milk Tea Series | Teh susu klasik...   | (url gambar)|

> Baris pertama = header (wajib persis seperti di atas)

---

## Langkah 3 — Buat Google Apps Script

1. Di spreadsheet, klik menu **Ekstensi → Apps Script**
2. Hapus semua kode yang ada
3. Copy-paste seluruh isi file **`Code.gs`** ke editor
4. Ganti baris ini dengan ID spreadsheet kamu:
   ```javascript
   const SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_KAMU';
   ```
5. Klik **Simpan** (ikon disket atau Ctrl+S)

---

## Langkah 4 — Deploy sebagai Web App

1. Klik tombol **Deploy → New deployment**
2. Klik ikon ⚙️ di sebelah "Select type" → pilih **Web app**
3. Isi pengaturan:
   - **Description**: Es Teh Ibukota API
   - **Execute as**: `Me (email kamu)`
   - **Who has access**: `Anyone` ← **WAJIB pilih ini**
4. Klik **Deploy**
5. Klik **Authorize access** → pilih akun Google kamu → Allow
6. Salin **Web app URL** yang muncul, contoh:
   ```
   https://script.google.com/macros/s/AKfycbxXXXXXXXXX/exec
   ```

---

## Langkah 5 — Pasang URL ke Website

Buka file **`js/app.js`** dan **`js/checkout.js`**, ganti baris ini:

```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
```

Jadi:

```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/URL_YANG_KAMU_SALIN/exec';
```

---

## Langkah 6 — Test

- Buka website → lakukan pemesanan
- Cek sheet **Pesanan** di spreadsheet → data harus masuk otomatis

---

## Catatan Penting

- Setiap kali kamu **edit kode** Apps Script, kamu harus **deploy ulang**
  (Deploy → Manage deployments → Edit → versi baru → Deploy)
- Jika produk tidak diambil dari spreadsheet, website akan tetap
  menggunakan data dari `app.js` sebagai fallback
- Sheet **Pesanan** akan otomatis dibuat headernya saat pesanan pertama masuk
