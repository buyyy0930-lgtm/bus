# BSU Chat

Bakı Dövlət Universiteti tələbələri üçün real-time mesajlaşma platforması.

## 🌐 Demo

**Sandbox URL**: https://3000-iys1lmsvwg68a6uyycuuz-2e1b9533.sandbox.novita.ai

**GitHub**: https://github.com/buyyy0930-lgtm/bus

## ✅ Son Yeniləmələr

### 🔥 Düzəldilmiş Problemlər:
- ✅ **Qalıcı Database**: Artıq server restart olduqda məlumatlar silinmir! (database.json)
- ✅ **Real-time Mesajlaşma**: Hər iki tərəf mesajları görür (Socket.IO düzəldildi)
- ✅ **16 Fakültə Ayrı Chat**: Hər fakültə öz ayrı chat otağında
- ✅ **Qaydalar Görünür**: İstifadəçilər qaydaları oxuya bilir
- ✅ **Şəxsi Chat Düzəldi**: İstifadəçi siyahısı və şəxsi mesajlaşma işləyir
- ✅ **Admin Dəyişiklikləri Qalır**: Bütün admin tənzimləmələri qalıcıdır

## 📱 Xüsusiyyətlər

### İstifadəçi Funksiyaları
- ✅ @bsu.edu.az email ilə qeydiyyat
- ✅ Telefon nömrəsi validasiyası (+994)
- ✅ **16 fakültə üzrə AYRI qrup chat otaqları**
- ✅ **Şəxsi mesajlaşma sistemi (istifadəçi seçimi ilə)**
- ✅ Doğrulama sualları (korpus məlumatları)
- ✅ Profil şəkli yükləmə
- ✅ İstifadəçi əngəlləmə
- ✅ Şikayət sistemi
- ✅ **Real-time mesajlaşma (hər iki tərəf görür)**
- ✅ Avtomatik mesaj silinmə
- ✅ Profil redaktə
- ✅ **Qaydalar bölməsi (hər kəs görür)**
- ✅ Tam mobil uyğunluq

### Admin Funksiyaları
- ✅ Super admin və alt admin sistemi
- ✅ İstifadəçi idarəetməsi (aktiv/deaktiv)
- ✅ **Günün mövzusu dəyişikliyi (real-time yenilənir)**
- ✅ **Qaydalar idarəetməsi (real-time yenilənir)**
- ✅ Filtr sözləri sistemi
- ✅ Şikayət edilən hesabların görüntülənməsi (16+ şikayət)
- ✅ Mesaj silinmə vaxtı tənzimləmələri
- ✅ **Bütün dəyişikliklər qalıcıdır (database.json)**

## 🚀 Texnologiyalar

- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO (düzəldilmiş broadcast)
- **Database**: JSON fayl (qalıcı, database.json)
- **File Upload**: Multer
- **Authentication**: bcryptjs, express-session (30 gün)

## 📦 Quraşdırma

### 1. Clone repository
```bash
git clone https://github.com/buyyy0930-lgtm/bus.git
cd bus
```

### 2. Dependencies yüklə
```bash
npm install
```

### 3. Serveri başlat
```bash
npm start
```

Server `http://localhost:3000` ünvanında işləyəcək.

## 🎯 İstifadə

### Admin Girişi
- **İstifadəçi adı**: 618ursamajor618
- **Şifrə**: 618ursa618

### Test İstifadəçi Qeydiyyatı
1. Qeydiyyat səhifəsinə gedin
2. Email: `test@bsu.edu.az` (istənilən email @bsu.edu.az ilə)
3. Telefon: `+994501234567` (istənilən nömrə)
4. Fakültə seçin (16 fakültədən biri)
5. Dərəcə və kurs seçin
6. Şifrə təyin edin
7. 3 doğrulama sualından minimum 2-sini düzgün cavablandırın

### Chat İstifadəsi
1. Qeydiyyatdan sonra chat səhifəsinə yönləndiriləcəksiniz
2. **Qrup Chat**: Avtomatik olaraq öz fakültənizin qrup chatındasınız
3. **Şəxsi Chat**: "Şəxsi Mesajlar" tabını seçin, istifadəçi siyahısından birini seçin
4. **Qaydalar**: Sağ yuxarıda ℹ️ ikonuna klikləyin

## 📋 16 Fakültə Siyahısı

| # | Fakültə | Korpus |
|---|---------|--------|
| 1 | Mexanika-riyaziyyat | **3** |
| 2 | Tətbiqi riyaziyyat və kibernetika | **3** |
| 3 | Fizika | **əsas** |
| 4 | Kimya | **əsas** |
| 5 | Biologiya | **əsas** |
| 6 | Ekologiya və torpaqşünaslıq | **əsas** |
| 7 | Coğrafiya | **əsas** |
| 8 | Geologiya | **əsas** |
| 9 | Filologiya | **1** |
| 10 | Tarix | **3** |
| 11 | Beynəlxalq münasibətlər və iqtisadiyyat | **1** |
| 12 | Hüquq | **1** |
| 13 | Jurnalistika | **2** |
| 14 | İnformasiya və sənəd menecmenti | **2** |
| 15 | Şərqşünaslıq | **2** |
| 16 | Sosial elmlər və psixologiya | **2** |

**Hər fakültə öz ayrı chat otağına malikdir!**

## 🌐 Deploy (Render.com)

### Çox Sadə - MongoDB Lazım Deyil! ✨

1. **Render.com**-a gedin
2. **New → Web Service**
3. GitHub repository seçin: `buyyy0930-lgtm/bus`
4. Tənzimləmələr:
   - **Name**: bsu-chat
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Create Web Service** düyməsini klikləyin
6. Deploy avtomatik başlayacaq (2-3 dəqiqə)
7. Hazırdır! ✅

**Qeyd**: 
- Environment variable tələb olunmur
- `database.json` avtomatik yaradılır və qalıcıdır
- Render.com-da disk storage qalıcıdır (silinmir)

## 📊 Texniki Detallar

### Database (Qalıcı)
- ✅ JSON fayl (database.json)
- ✅ Avtomatik yaradılır
- ✅ Hər dəyişiklikdə avtomatik save olunur
- ✅ Server restart olsa da məlumatlar qalır

### Real-time Mesajlaşma
- ✅ Socket.IO rooms (hər fakültə ayrı room)
- ✅ Broadcast düzəldilmiş (hər iki tərəf mesajları görür)
- ✅ Private chat rooms (istifadəçi-istifadəçi)

### Session İdarəetməsi
- ✅ 30 günlük cookie
- ✅ Qalıcı session
- ✅ Avtomatik logout etmir

## 📱 Mobil Uyğunluq

- ✅ 360-430px ekran ölçülərinə optimizasiya
- ✅ Touch-friendly interfeys
- ✅ Responsive dizayn
- ✅ Android Chrome və iOS Safari dəstəyi

## 📁 Layihə Strukturu

```
bus/
├── server.js          # Express və Socket.IO server
├── package.json       # Dependencies
├── database.json      # Qalıcı database (avtomatik yaradılır)
├── public/           # Frontend faylları
│   ├── index.html    # Giriş və qeydiyyat
│   ├── chat.html     # Chat interfeysi
│   ├── admin.html    # Admin paneli
│   └── uploads/      # Profil şəkilləri
└── README.md
```

## 🔧 Fayl Açıqlamaları

- **database.json**: Bütün məlumatlar burada (users, messages, settings, reports)
- **uploads/**: Profil şəkilləri burada saxlanılır
- **server.js**: Əsas server, Socket.IO və API routes

## 📝 Lisenziya

MIT

## 👥 Əlaqə

Bakı Dövlət Universiteti - BSU Chat Platform

---

**Xüsusi Qeyd**: Bütün problemlər həll edildi! ✅
- 16 fakültə ayrı chat otaqlarında
- Mesajlar qarşılıqlı görünür
- Qaydalar hər kəsə görünür
- Şəxsi chat tam işləkdir
- Database qalıcıdır
- Admin dəyişiklikləri saxlanılır
