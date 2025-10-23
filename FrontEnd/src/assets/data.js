import vec from './image/vector.png'
import ro from './image/round.png'
import fe from './image/free.png'


import ipho from './image/iphone 1.png'
import ipa from './image/ipad 1.png'
import an from './image/android 1.png'
import tab from './image/tablet 1.png'


import fa from './image/face.png'
import ins from './image/insta.png'
import tw from './image/tiw.png'


import bo from './image/book.png';
import app from './image/apple.png';
import ba from './image/bol.png';
import hu from './image/hrut.png';
import li from './image/light.png';


import battery from './image/battery2.png';
import broken from './image/broken-screen1.png';



export const ServiceData = [
  { logo: vec, heading: "Trusted Professionals", tex: "Rely on our team of professional technicians. We have a vast network of experts ready to assist you." },
  { logo: ro, heading: "Quick Turnaround", tex: "We aim to return your device as swiftly as possible, often completing repairs in 30 minutes or less." },
  { logo: fe, heading: "Free Diagnostics", tex: "Unsure about the issue with your device? Don't worry, we offer a complimentary diagnosis." }
];

export const ModleData = [
  { im: ipho, head: "iPhone", tx: "Cracked screens, water damage, battery problems, and more." },
  { im: ipa, head: "iPad", tx: "Cracked screens, water damage, battery problems, and more." },
  { im: an, head: "Android", tx: "We can do complex repairs like motherboard replacements." },
  { im: tab, head: "Tablet", tx: "Fast and cost-effective solutions for all kinds of tablets." }
];


export const brands = ["Apple", "Samsung", "Xiaomi", "Realme", "Oppo", "Huawei", "Infinix", "Nokia", "Oneplus", "Google"];


export const mobiles = ["iPhone 15 Pro", "Samsung Galaxy S22", "OnePlus 12R", "Realme C67", "Oppo A18", "Xiaomi Redmi Note 13", "Samsung Galaxy S23", "Infinix Hot 40 Pro"];


export const Simg = [fa, ins, tw];

export const aboutItms = [
  {
    icon: bo,
    title: 'Reliability',
    bg: 'bg-gray-100',
    points: [
      'We are open as a team and as a product.',
      'We don’t put walls up unless it’s necessary.',
      'We become better when we share information.',
      'We are open to diversity of opinion, backgrounds, and thought.'
    ],
  },
  {
    icon: app,
    title: 'Professional Partners',
    bg: 'bg-gray-50',
    points: [
      'We want the best for our customers and ourselves.',
      'We coach people to their best potential.',
      'That’s why an "Arcader" is both a teammate and a customer.'
    ],
  },
  {
    icon: li,
    title: 'Fast Service',
    bg: 'bg-green-50',
    points: [
      'We act like owners.',
      'Let’s empower each other.',
      'If we see something that needs change, we lead through it.'
    ],
  },
  {
    icon: ba,
    title: 'Online Access',
    bg: 'bg-purple-50',
    points: [
      'We play because we’re a creator tool.',
      'Life is short. Let’s build something meaningful.',
      'We play as a team because great teams build great things together.',
      'We keep those standards high.'
    ],
  },
  {
    icon: hu,
    title: 'Trusted',
    bg: 'bg-blue-50',
    points: [
      'We can be honest and kind.',
      'We can have high standards and be kind.',
      'We can say no and be kind.'
    ],
  },
];



//Faq
export const QA = [
  { Q: "Do you have a revenue share?", A: "No, we offer a buy-rate, interchange-plus pricing model giving you the most control over your revenue." },
  { Q: "Do you have any minimum fees or fixed monthly fees?", A: "Yes, many processors charge a minimum monthly fee or a fixed monthly fee for account maintenance, gateway access, or support." },
  { Q: "Do you charge any PCI DSS program or non-compliance fees?", A: "Yes, PCI compliance fees are common to cover security requirements. Non-compliance fees apply if you fail to meet PCI standards." },
  { Q: "Can I set the pricing to my merchants?", A: "Yes, if you're using a white-label or ISO model, you can set custom pricing for your merchants. Some platforms restrict this." },
  { Q: "Are the pricing tiers “pick a tier” or “fill a tier”?", A: "Most providers use a “fill a tier” model where different volume ranges are charged at different rates, similar to tax brackets." },
  { Q: "Do you charge an ACH volume-based fee?", A: "Yes, ACH transactions typically have a volume-based fee — either a flat amount per transaction or a percentage of the transaction total." }
];

//Issue type
export const issueData = [{ic: battery , data: "Battery & Charging"},
  {ic: broken , data: "Screen Issues"},
  {data: "Audio Issues"},
  {data: "Camera Problems"},
  {data: "other"}];



export const brand = ["Apple", "Samsung", "OnePlus", "Xiaomi", "Realme", "Vivo", "Oppo", "Other"];


export const Service = ["Pickup by Yourelf" , "Pickup by Person", "Technician at Home"];


export const UrgencyData = ["Normal","Urgent","Same Day"];