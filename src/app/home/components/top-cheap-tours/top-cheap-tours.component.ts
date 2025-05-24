import { Component, Input } from '@angular/core';
import { Tour } from '../../../tours/interfaces/tour';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-top-cheap-tours',
  standalone: false,
  templateUrl: './top-cheap-tours.component.html',
  styleUrl: './top-cheap-tours.component.css',
})
export class TopCheapToursComponent {
  @Input() topCheapTours: Tour[] = [];
  imgUrl = environment.imgUrl; // رابط الصورة
  // أضف هذه الأجزاء إلى ملف StatisticsComponent الخاص بك

  // متغيرات الكاروسيل الأسطواني
  cylinderRotation: number = 0; // زاوية دوران الأسطوانة
  activeCardIndex: number = 0; // البطاقة النشطة حالياً
  autoRotateInterval: any; // معرف الفاصل الزمني للدوران التلقائي
  isAutoRotating: boolean = true; // حالة الدوران التلقائي

  // إضافة في ngOnInit
  ngOnInit() {
    console.log('TopCheapToursComponent initialized: ', this.topCheapTours);
    this.refreshData();
    // بدء دوران الكاروسيل بعد تحميل البيانات
    setTimeout(() => {
      this.initCylinderCarousel();
    }, 1000);
  }

  // تحديث البيانات
  refreshData() {
    // قم بإضافة منطق تحديث البيانات هنا
    console.log('Refreshing data...');
  }

  // تهيئة الكاروسيل الأسطواني
  initCylinderCarousel() {
    this.startAutoRotate();
  }

  // حساب تحويل البطاقة على الأسطوانة
  getCylinderCardTransform(index: number): string {
    const angle = 360 / this.topCheapTours.length;
    const cardAngle = angle * index;
    const radius = 400; // نصف قطر الأسطوانة

    return `rotateY(${cardAngle}deg) translateZ(${radius}px)`;
  }

  // تدوير إلى البطاقة التالية
  rotateNext() {
    const anglePerCard = 360 / this.topCheapTours.length;
    this.cylinderRotation -= anglePerCard;
    this.updateActiveCard();
  }

  // تدوير إلى البطاقة السابقة
  rotatePrev() {
    const anglePerCard = 360 / this.topCheapTours.length;
    this.cylinderRotation += anglePerCard;
    this.updateActiveCard();
  }

  // تحديث البطاقة النشطة بناءً على زاوية الدوران
  updateActiveCard() {
    // حساب البطاقة النشطة من زاوية الدوران
    const anglePerCard = 360 / this.topCheapTours.length;
    // تحويل الزاوية إلى نطاق إيجابي (0-360)
    let normalizedRotation = this.cylinderRotation % 360;
    if (normalizedRotation < 0) normalizedRotation += 360;

    // حساب الفهرس النشط (البطاقة المواجهة للأمام)
    this.activeCardIndex =
      Math.round(normalizedRotation / anglePerCard) % this.topCheapTours.length;
  }

  // بدء الدوران التلقائي
  startAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
    }

    this.isAutoRotating = true;
    this.autoRotateInterval = setInterval(() => {
      this.rotateNext();
    }, 5000); // دوران كل ثانية
  }

  // إيقاف الدوران التلقائي
  stopAutoRotate() {
    this.isAutoRotating = false;
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
  }

  // تبديل حالة الدوران التلقائي
  toggleAutoRotate() {
    if (this.isAutoRotating) {
      this.stopAutoRotate();
    } else {
      this.startAutoRotate();
    }
  }

  // الانتقال إلى بطاقة محددة
  goToCard(index: number) {
    const anglePerCard = 360 / this.topCheapTours.length;
    this.cylinderRotation = -anglePerCard * index;
    this.updateActiveCard();
  }

  // تنظيف الفواصل الزمنية عند تدمير المكون
  ngOnDestroy() {
    this.stopAutoRotate();
  }
}
