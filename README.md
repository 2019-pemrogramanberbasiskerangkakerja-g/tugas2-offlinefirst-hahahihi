# Pemrograman Berbasis Kerangka Kerja
## Tugas 2 - Offline First
   
   - **Hilmi Raditya       05111640000164**
   - **Naufal Pranasetyo   05111540000057**
   - **Muhammad Akram A.   05111540000050**

Database yang digunakan: 
1. [MongoDB](https://www.mongodb.com/)
2. [MongoDB Compass - GUI untuk melihat database](https://www.mongodb.com/download-center/compass?jmp=docs/)

## Fungsi
1. Registrasi User melalui Database Pusat (Online)
2. Login melalui Database Lokal saat DB Pusat putus koneksi
3. Input Log ke Database Lokal
4. Sync Log dari Database Pusat ke DB Lokal
   
## Cara Menjalankan:
1. Install NodeJS dan MongoDB
2. Clone repository ini, lalu buka terminal
3. Masuk ke folder dari repositori yang sudah di clone 
4. Pada PC sebagai server, masuk ke folder `register` untuk menyimpan pada DB Pusat
5. Pada PC lokal, masuk ke folder `login` untuk melakukan login melalui PC berbeda
6. Jalankan `npm install` dan `npm install nodemon -g` untuk download dependencies 
7. Jalankan `nodemon` untuk memulai aplikasinya di masing-masing PC
8. Buka browser dan ketik alamat `localhost:8000` untuk melihat hasilnya. Berikut hasilnya:

![hasil](/hasil1.png)
![login](/hasil2.png)
