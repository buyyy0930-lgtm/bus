# BSU Chat

Bakı Dövlət Universiteti tələbələri üçün real-time mesajlaşma platforması.

## Xüsusiyyətlər

### İstifadəçi Funksiyaları
- ✅ @bsu.edu.az email ilə qeydiyyat
- ✅ Telefon nömrəsi validasiyası (+994)
- ✅ 16 fakültə üzrə ayrı qrup chat otaqları
- ✅ Şəxsi mesajlaşma sistemi
- ✅ Doğrulama sualları (korpus məlumatları)
- ✅ Profil şəkli yükləmə
- ✅ İstifadəçi əngəlləmə
- ✅ Şikayət sistemi
- ✅ Real-time mesajlaşma (Socket.IO)
- ✅ Avtomatik mesaj silinmə
- ✅ Profil redaktə

### Admin Funksiyaları
- ✅ Super admin və alt admin sistemi
- ✅ İstifadəçi idarəetməsi (aktiv/deaktiv)
- ✅ Günün mövzusu dəyişikliyi
- ✅ Qaydalar idarəetməsi
- ✅ Filtr sözləri sistemi
- ✅ Şikayət edilən hesabların görüntülənməsi (16+ şikayət)
- ✅ Mesaj silinmə vaxtı tənzimləmələri

## Texnologiyalar

- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO
- **Database**: MongoDB
- **File Upload**: Multer
- **Authentication**: bcryptjs, express-session

## Quraşdırma

### 1. Dependencies yüklə
```bash
npm install
```

### 2. Environment Variables
`.env` faylı yarat:
```
MONGODB_URI=mongodb://localhost:27017/bsu-chat
PORT=3000
SESSION_SECRET=your-secret-key
```

### 3. MongoDB Quraşdırması
MongoDB lokal və ya cloud (MongoDB Atlas) olaraq işləməlidir.

### 4. Serveri başlat
```bash
npm start
```

## Deploy (Render.com)

### 1. GitHub repository yarat və push et

### 2. Render.com-da Web Service yarat
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Environment Variables əlavə et
- `MONGODB_URI`: MongoDB connection string (MongoDB Atlas istifadə edin)
- `SESSION_SECRET`: Random secret key

### 4. Deploy et

## Super Admin Girişi

- **İstifadəçi adı**: 618ursamajor618
- **Şifrə**: 618ursa618

## Fakültələr

1. Mexanika-riyaziyyat
2. Tətbiqi riyaziyyat və kibernetika
3. Fizika
4. Kimya
5. Biologiya
6. Ekologiya və torpaqşünaslıq
7. Coğrafiya
8. Geologiya
9. Filologiya
10. Tarix
11. Beynəlxalq münasibətlər və iqtisadiyyat
12. Hüquq
13. Jurnalistika
14. İnformasiya və sənəd menecmenti
15. Şərqşünaslıq
16. Sosial elmlər və psixologiya

## Doğrulama Sualları Cavabları

- Mexanika-riyaziyyat: **3**
- Tətbiqi riyaziyyat və kibernetika: **3**
- Fizika: **əsas**
- Kimya: **əsas**
- Biologiya: **əsas**
- Ekologiya və torpaqşünaslıq: **əsas**
- Coğrafiya: **əsas**
- Geologiya: **əsas**
- Filologiya: **1**
- Tarix: **3**
- Beynəlxalq münasibətlər və iqtisadiyyat: **1**
- Hüquq: **1**
- Jurnalistika: **2**
- İnformasiya və sənəd menecmenti: **2**
- Şərqşünaslıq: **2**
- Sosial elmlər və psixologiya: **2**

## Lisenziya

MIT

## Əlaqə

Bakı Dövlət Universiteti - BSU Chat
