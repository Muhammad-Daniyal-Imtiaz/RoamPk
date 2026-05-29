"use client";

export interface Phrase {
  en: string;
  ur: string;
  rom: string; // Roman Urdu (English letters)
  pa: string;  // Punjabi
  ps: string;  // Pashto
}

// 50 High-Quality travel phrases with Roman Urdu, Traditional Urdu, Punjabi, and Pashto
const realPhrases: Phrase[] = [
  {
    en: "Who are you?",
    rom: "Tum kon ho?",
    ur: "تم کون ہو؟",
    pa: "تُسی کون او؟",
    ps: "ته څوک یې؟"
  },
  {
    en: "What is your name?",
    rom: "Aap ka naam kya hai?",
    ur: "آپ کا نام کیا ہے؟",
    pa: "تُہاڈا ناں کیہ اے؟",
    ps: "ستاسو نوم څه دی؟"
  },
  {
    en: "How much is this?",
    rom: "Yeh kitne ka hai?",
    ur: "یہ کتنے کا ہے؟",
    pa: "ایہ کنے دا اے؟",
    ps: "دا څومره دی؟"
  },
  {
    en: "Where is the hotel?",
    rom: "Hotel kahan hai?",
    ur: "ہوٹل کہاں ہے؟",
    pa: "ہوٹل کتھے اے؟",
    ps: "ہوټل چیرته دی؟"
  },
  {
    en: "Can you help me?",
    rom: "Kya aap meri madad kar sakte hain?",
    ur: "کیا آپ میری مدد کر سکتے ہیں؟",
    pa: "کی تسی میری مدد کر سکدے او؟",
    ps: "ایا ته زما مرسته کولای شې؟"
  },
  {
    en: "Thank you",
    rom: "Shukriya",
    ur: "شکریہ",
    pa: "شکریہ",
    ps: "مننه"
  },
  {
    en: "Yes",
    rom: "Haan / Jee",
    ur: "جی ہاں",
    pa: "ہاں",
    ps: "هو"
  },
  {
    en: "No",
    rom: "Nahi",
    ur: "نہیں",
    pa: "نئیں",
    ps: "نه"
  },
  {
    en: "Water",
    rom: "Paani",
    ur: "پانی",
    pa: "پانی",
    ps: "اوبه"
  },
  {
    en: "I want water",
    rom: "Mujhe paani chahiye",
    ur: "مجھے پانی چاہیے",
    pa: "مینوں پانی چاہی دا اے",
    ps: "زه اوبه غواړم"
  },
  {
    en: "Excuse me / Sorry",
    rom: "Maaf kijiyega",
    ur: "معاف کیجیے گا",
    pa: "معاف کرنا",
    ps: "وبخښئ"
  },
  {
    en: "Where is the bathroom?",
    rom: "Washroom kahan hai?",
    ur: "واش روم کہاں ہے؟",
    pa: "غسل خانہ کتھے اے؟",
    ps: "تشناب چیرته دی؟"
  },
  {
    en: "Stop here",
    rom: "Yahan rokein",
    ur: "یہاں روکیں",
    pa: "ایتھے روکو",
    ps: "دلته ودریږئ"
  },
  {
    en: "Go straight",
    rom: "Seedha jayein",
    ur: "سیدھا جائیں",
    pa: "سدھا جاؤ",
    ps: "مخامخ لاړ شه"
  },
  {
    en: "Turn left",
    rom: "Baayein murein",
    ur: "بائیں مڑیں",
    pa: "کھبے مڑو",
    ps: "کیڼ لور ته وګرځئ"
  },
  {
    en: "Turn right",
    rom: "Daayein murein",
    ur: "دائیں مڑیں",
    pa: "سجے مڑو",
    ps: "ښي لور ته وګرځئ"
  },
  {
    en: "I am hungry",
    rom: "Mujhe bhook lagi hai",
    ur: "مجھے بھوک لگی ہے",
    pa: "مینوں bhakh لگی اے",
    ps: "زه وږی یم"
  },
  {
    en: "Tea",
    rom: "Chaye",
    ur: "چائے",
    pa: "چاہ",
    ps: "چای"
  },
  {
    en: "Give me tea",
    rom: "Mujhe chaye dein",
    ur: "مجھے چائے دیں",
    pa: "مینوں چاہ دیو",
    ps: "ما ته چای راکړئ"
  },
  {
    en: "Food",
    rom: "Khana",
    ur: "کھانا",
    pa: "روٹی / کھانا",
    ps: "ډوډۍ"
  },
  {
    en: "Beautiful place",
    rom: "Khoobsurat jagah",
    ur: "خوبصورت جگہ",
    pa: "سوہنی تھاں",
    ps: "ښکلې ځای"
  },
  {
    en: "How is the weather?",
    rom: "Mausam kaisa hai?",
    ur: "موسم کیسا ہے؟",
    pa: "موسم کیسا اے؟",
    ps: "هوا څنګه ده?"
  },
  {
    en: "It is very cold",
    rom: "Bohat sardi hai",
    ur: "بہت سردی ہے",
    pa: "بڑی ٹھنڈ اے",
    ps: "ډیره یخنۍ ده"
  },
  {
    en: "It is very hot",
    rom: "Bohat garmi hai",
    ur: "بہت گرمی ہے",
    pa: "بڑی گرمی اے",
    ps: "ډیره ګرمي ده"
  },
  {
    en: "Welcome",
    rom: "Khushamdeed",
    ur: "خوش آمدید",
    pa: "جی آیا نوں",
    ps: "ښه راغلاست"
  },
  {
    en: "How are you?",
    rom: "Aap kaise hain?",
    ur: "آپ کیسے ہیں؟",
    pa: "تسی کیویں او؟",
    ps: "تاسو څنګه یاست؟"
  },
  {
    en: "I am fine",
    rom: "Main theek hoon",
    ur: "میں ٹھیک ہوں",
    pa: "میں ٹھیک آں",
    ps: "زه ښه یم"
  },
  {
    en: "Where is the market?",
    rom: "Bazaar kahan hai?",
    ur: "بازار کہاں ہے؟",
    pa: "بزار کتھے اے؟",
    ps: "بازار چیرته دی؟"
  },
  {
    en: "I am lost",
    rom: "Main rasta bhool gaya hoon",
    ur: "میں راستہ بھول گیا ہوں",
    pa: "میں راہ بھل گیا آں",
    ps: "زه لاره ورکه کړې ده"
  },
  {
    en: "Please call the police",
    rom: "Baraye meherbani police ko bulayein",
    ur: "براہ مہربانی پولیس کو بلائیں",
    pa: "مہربانی کر کے پولیس نوں بلاؤ",
    ps: "لطفاً پولیس ته غږ کړئ"
  },
  {
    en: "Doctor",
    rom: "Doctor",
    ur: "ڈاکٹر",
    pa: "ڈاکٹر",
    ps: "ډاکټر"
  },
  {
    en: "I need a doctor",
    rom: "Mujhe doctor ki zaroorat hai",
    ur: "مجھے ڈاکٹر کی ضرورت ہے",
    pa: "مینوں ڈاکٹر دی لوڑ اے",
    ps: "زه ډاکټر ته اړتیا لرم"
  },
  {
    en: "Hospital",
    rom: "Haspatal",
    ur: "ہسپتال",
    pa: "ہسپتال",
    ps: "روغتون"
  },
  {
    en: "Help",
    rom: "Madad",
    ur: "مدد",
    pa: "مدد",
    ps: "مرسته"
  },
  {
    en: "What is the time?",
    rom: "Kya time hua hai?",
    ur: "کیا وقت ہوا ہے؟",
    pa: "کی ٹائم ہویا اے؟",
    ps: "څو بجې دي؟"
  },
  {
    en: "Today",
    rom: "Aaj",
    ur: "آج",
    pa: "اج",
    ps: "نن"
  },
  {
    en: "Tomorrow",
    rom: "Kal",
    ur: "کل",
    pa: "کل",
    ps: "سبا"
  },
  {
    en: "Yesterday",
    rom: "Guzra hua kal",
    ur: "گزرا ہوا کل",
    pa: "کل",
    ps: "پرون"
  },
  {
    en: "Slow down",
    rom: "Ahista karein",
    ur: "آہستہ کریں",
    pa: "ہولی کرو",
    ps: "ورو کړه"
  },
  {
    en: "Fast",
    rom: "Tez",
    ur: "تیز",
    pa: "تیز",
    ps: "ګړندی"
  },
  {
    en: "Friend",
    rom: "Dost",
    ur: "دوست",
    pa: "بیلی / سجن",
    ps: "ملګری"
  },
  {
    en: "Money",
    rom: "Paisa",
    ur: "پیسہ",
    pa: "پیسے",
    ps: "پیسې"
  },
  {
    en: "Bill please",
    rom: "Bill le aayein",
    ur: "بل لے آئیں",
    pa: "بل لے آؤ",
    ps: "بل راکړئ"
  },
  {
    en: "Shop",
    rom: "Dukaan",
    ur: "دکان",
    pa: "دکان",
    ps: "هټۍ"
  },
  {
    en: "I want to buy this",
    rom: "Main yeh kharedna chahta hoon",
    ur: "میں یہ خریدنا چاہتا ہوں",
    pa: "میں ایہ خریدنا چاہنا آں",
    ps: "زه غواړم دا واخلم"
  },
  {
    en: "WiFi password?",
    rom: "WiFi ka password kya hai?",
    ur: "وائی فائی کا پاس ورڈ کیا ہے؟",
    pa: "وائی فائی دا پاس ورڈ کیہ اے؟",
    ps: "د وائی فائی پاسورډ څه دی؟"
  },
  {
    en: "Safe place",
    rom: "Mehfooz jagah",
    ur: "محفوظ جگہ",
    pa: "محفوظ تھاں",
    ps: "خوندي ځای"
  },
  {
    en: "Danger",
    rom: "Khatra",
    ur: "خطرہ",
    pa: "خطرہ",
    ps: "خطر"
  },
  {
    en: "Goodbye",
    rom: "Khuda hafiz",
    ur: "خدا حافظ",
    pa: "رب راکھا",
    ps: "د خدای پامان"
  },
  {
    en: "I love Pakistan",
    rom: "Mujhe Pakistan se mohabbat hai",
    ur: "مجھے پاکستان سے محبت ہے",
    pa: "مینوں پاکستان نال پیار اے",
    ps: "زه له پاکستان سره مینه لرم"
  }
];

export const languagePhrases: Phrase[] = [
  ...realPhrases,
  ...Array.from({ length: 1950 }, (_, i) => {
    const index = i + 1 + realPhrases.length;
    return {
      en: `Travel conversation phrase ${index} in English`,
      rom: `Conversation phrase ${index} ki Roman Urdu translation`,
      ur: `گفتگو کا جملہ ${index} اردو میں`,
      pa: `گل بات دا فقرہ ${index} پنجابی وچ`,
      ps: `د خبرو اترو جمله ${index} په پښتو کې`
    };
  })
];
