# Happy Baby Night Nurses - Project Scope Document

## 📋 Proje Genel Bakış

**Proje Adı:** Happy Baby Night Nurses  
**Versiyon:** 1.0.0  
**Platform:** iOS, Android, Web  
**Teknoloji Stack:** React Native, Expo, TypeScript  
**Geliştirme Durumu:** Geliştirme Aşamasında  

## 🎯 Proje Amacı

Happy Baby Night Nurses, gece hemşireliği hizmeti veren bir şirketin operasyonlarını yönetmek için geliştirilmiş kapsamlı bir mobil uygulamasıdır. Uygulama üç ana kullanıcı grubunu destekler:

1. **Aileler** - Gece hemşiresi hizmeti alan aileler
2. **Hemşireler** - Gece hemşireliği hizmeti veren profesyoneller  
3. **Yöneticiler** - Şirket operasyonlarını yöneten admin kullanıcıları

## 👥 Hedef Kullanıcılar

### 1. Aile Kullanıcıları (Family)
- **Profil:** Yeni ebeveynler, çoklu bebek aileleri
- **İhtiyaçlar:** Gece hemşiresi rezervasyonu, iletişim, günlük raporlar
- **Özellikler:**
  - Hemşire rezervasyonu ve planlama
  - Hemşire profillerini görüntüleme
  - Gece günlüklerini takip etme
  - Hemşire ile mesajlaşma
  - Ödeme yönetimi
  - Bildirimler

### 2. Hemşire Kullanıcıları (Nurse)
- **Profil:** Gece hemşireliği uzmanları
- **İhtiyaçlar:** Vardiya yönetimi, aile iletişimi, raporlama
- **Özellikler:**
  - Vardiya takvimi ve müsaitlik yönetimi
  - Aile profillerini görüntüleme
  - Gece günlüğü tutma
  - Aile ile mesajlaşma
  - Eğitim materyalleri
  - Vardiya başlangıç/bitiş kayıtları

### 3. Yönetici Kullanıcıları (Admin)
- **Profil:** Şirket yöneticileri, operasyon müdürleri
- **İhtiyaçlar:** Tüm operasyonları yönetme, raporlama, finansal takip
- **Özellikler:**
  - Aile ve hemşire yönetimi
  - Vardiya planlama ve atama
  - Maaş ve ödeme yönetimi
  - Finansal dashboard
  - Toplu mesajlaşma
  - Raporlama ve analitik

## 🏗️ Teknik Mimari

### Teknoloji Stack
- **Frontend:** React Native 0.76.9
- **Framework:** Expo SDK 52
- **Navigation:** Expo Router v4
- **Dil:** TypeScript
- **UI Kütüphanesi:** Lucide React Native
- **State Management:** React Context API
- **Animasyonlar:** React Native Reanimated
- **Platform Desteği:** iOS, Android, Web

### Proje Yapısı
```
app/
├── _layout.tsx              # Ana layout
├── index.tsx                # Giriş noktası
├── auth/                    # Kimlik doğrulama
├── family/                  # Aile kullanıcı arayüzü
├── nurse/                   # Hemşire kullanıcı arayüzü
├── admin/                   # Yönetici arayüzü
└── shared/                  # Paylaşılan bileşenler

components/
├── common/                  # Genel bileşenler
├── family/                  # Aile özel bileşenleri
└── nurse/                   # Hemşire özel bileşenleri

context/
├── AuthContext.tsx          # Kimlik doğrulama context'i
└── ThemeContext.tsx         # Tema context'i

hooks/
├── useFamily.ts             # Aile veri hook'u
└── useFrameworkReady.ts     # Framework hazırlık hook'u

constants/
└── Colors.ts                # Renk paleti

utils/
└── dateUtils.ts             # Tarih yardımcı fonksiyonları
```

## 🔐 Kimlik Doğrulama Sistemi

### Kullanıcı Rolleri
- **Family:** Aile kullanıcıları
- **Nurse:** Hemşire kullanıcıları  
- **Admin:** Yönetici kullanıcıları (@happybabynightnurses.com domain)

### Güvenlik Özellikleri
- Email domain bazlı rol ataması
- İlk giriş deneyimi (Family kullanıcıları için)
- Oturum yönetimi
- Mock kullanıcı sistemi (geliştirme aşamasında)

## 📱 Ana Özellikler

### Aile Kullanıcıları İçin
1. **Ana Sayfa (Home)**
   - Yaklaşan vardiyalar
   - Hemşire profilleri
   - Bildirimler
   - Hızlı erişim menüleri

2. **Vardiya Planlama (Schedule)**
   - Vardiya rezervasyonu
   - Hemşire seçimi
   - Tarih ve saat seçimi
   - Vardiya onayı

3. **Gece Günlükleri (Logs)**
   - Hemşire günlüklerini görüntüleme
   - Bebek aktivite takibi
   - Beslenme ve uyku kayıtları
   - Fotoğraf paylaşımı

4. **Mesajlaşma (Messages/Messenger)**
   - Hemşire ile birebir mesajlaşma
   - Dosya ve fotoğraf paylaşımı
   - Mesaj geçmişi

5. **Hemşire Profilleri (Nurse Profiles)**
   - Detaylı hemşire bilgileri
   - Deneyim ve sertifikalar
   - Değerlendirmeler
   - İletişim bilgileri

6. **Ayarlar ve Profil (More)**
   - Profil yönetimi
   - Bildirim ayarları
   - Ödeme bilgileri
   - Yardım ve destek

### Hemşire Kullanıcıları İçin
1. **Ana Sayfa (Home)**
   - Günlük vardiya özeti
   - Bildirimler
   - Hızlı erişim

2. **Müsaitlik Yönetimi (Availability)**
   - Müsaitlik takvimi
   - Vardiya kabul/red
   - Özel durum bildirimleri

3. **Gece Günlükleri (Night Logs)**
   - Detaylı günlük tutma
   - Bebek aktivite kayıtları
   - Fotoğraf ekleme
   - Aileye rapor gönderme

4. **Aile Profilleri (Family Profiles)**
   - Aile bilgileri
   - Bebek detayları
   - Özel talimatlar
   - İletişim bilgileri

5. **Eğitimler (Trainings)**
   - Eğitim materyalleri
   - Sertifika takibi
   - Gelişim kayıtları

6. **Grup Sohbeti (Group Chat)**
   - Diğer hemşirelerle iletişim
   - Deneyim paylaşımı
   - Yönetici iletişimi

### Yönetici Kullanıcıları İçin
1. **Ana Sayfa (Home)**
   - Operasyon özeti
   - İstatistikler
   - Acil durumlar

2. **Aile Yönetimi (Families)**
   - Aile profilleri
   - Hizmet geçmişi
   - İletişim yönetimi

3. **Hemşire Yönetimi (Nurses)**
   - Hemşire profilleri
   - Performans takibi
   - Müsaitlik yönetimi

4. **Vardiya Yönetimi (Manage Shifts)**
   - Vardiya planlama
   - Hemşire atama
   - Çakışma kontrolü
   - Otomatik bildirimler

5. **Maaş Yönetimi (Manage Payroll)**
   - Vardiya saatleri
   - Maaş hesaplama
   - Ödeme takibi
   - Raporlama

6. **Finansal Dashboard (Expense Dashboard)**
   - Gelir/gider takibi
   - Aylık raporlar
   - Finansal analitik

7. **Mesajlaşma (Messenger)**
   - Toplu mesaj gönderme
   - Hemşire iletişimi
   - Acil durum bildirimleri

8. **Gece Günlükleri (Night Logs)**
   - Tüm günlükleri görüntüleme
   - Kalite kontrolü
   - Raporlama

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Primary:** #4F86E7 (Mavi)
- **Secondary:** #8AB4F8 (Açık Mavi)
- **Accent:** #FFA726 (Turuncu)
- **Success:** #4CAF50 (Yeşil)
- **Warning:** #FFC107 (Sarı)
- **Error:** #F44336 (Kırmızı)

### UI Bileşenleri
- Modern ve temiz tasarım
- Responsive layout
- Accessibility desteği
- Dark/Light tema desteği
- Animasyonlar ve geçişler

## 📊 Veri Yönetimi

### Mevcut Durum
- Mock veri sistemi (geliştirme aşamasında)
- Local state management
- Context API kullanımı

### Gelecek Planlar
- Backend API entegrasyonu
- Real-time veri senkronizasyonu
- Offline veri desteği
- Push notification sistemi

## 🔧 Geliştirme Ortamı

### Gereksinimler
- Node.js 20+
- Expo CLI
- iOS Simulator / Android Emulator
- Git

### Kurulum
```bash
npm install
npx expo start
```

### Build Komutları
```bash
# Development
npm start

# Production Build
eas build --platform ios
eas build --platform android

# Web Build
npm run build:web
```

## 🚀 Deployment

### Platform Desteği
- **iOS:** App Store (Apple Developer Program gerekli)
- **Android:** Google Play Store
- **Web:** Progressive Web App (PWA)

### Build Konfigürasyonu
- EAS Build sistemi
- Apple Developer Team ID: 593LST2FAV
- Bundle ID: com.happybaby.nightnurses

## 📈 Gelecek Geliştirmeler

### Kısa Vadeli (1-3 ay)
- Backend API entegrasyonu
- Push notification sistemi
- Gerçek ödeme entegrasyonu
- Offline mod desteği

### Orta Vadeli (3-6 ay)
- Video görüşme özelliği
- AI destekli raporlama
- Gelişmiş analitik dashboard
- Çoklu dil desteği

### Uzun Vadeli (6+ ay)
- IoT cihaz entegrasyonu
- Machine learning özellikleri
- Gelişmiş güvenlik özellikleri
- Enterprise özellikleri

## 🐛 Bilinen Sorunlar

### Teknik Sorunlar
- Apple Developer Program Individual hesap kısıtlaması
- EAS Build konfigürasyon sorunları
- Mock veri sistemi (production için uygun değil)

### UI/UX Sorunları
- Bazı ekranlarda responsive tasarım iyileştirmeleri gerekli
- Accessibility özelliklerinin genişletilmesi
- Performance optimizasyonları

## 📞 İletişim ve Destek

### Geliştirme Ekibi
- **Proje Sahibi:** DEVteam2025
- **Teknoloji:** React Native / Expo
- **Versiyon:** 1.0.0

### Destek
- Dokümantasyon: Bu dosya
- Teknik sorunlar: GitHub Issues
- Kullanıcı desteği: info@happybabynightnurses.com

---

**Son Güncelleme:** Ocak 2025  
**Dokümantasyon Versiyonu:** 1.0  
**Durum:** Geliştirme Aşamasında 