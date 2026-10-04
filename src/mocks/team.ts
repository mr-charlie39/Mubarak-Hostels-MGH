import mubarakPhoto from "@/assets/mubarak-mehdi.jpeg";
import usamaPhoto from "@/assets/usama-rafiq.jpeg";
import yousafPhoto from "@/assets/yousaf-mehsood.jpeg";
import abdullahPhoto from "@/assets/abdullah.jpeg";
import bilalPhoto from "@/assets/bilal-ahmed.jpeg";
import badarPhoto from "@/assets/badar-mahmood.jpeg";
import quaidPhoto from "@/assets/quaid-lucky.jpeg";

export const ceo = {
  name: "Mubarak Mehdi",
  title: "Founder & CEO",
  designation:
    "Founder & CEO of Mubarak Group of Hostels and multiple ventures across Pakistan.",
  photo: mubarakPhoto,
  intro:
    "A visionary entrepreneur, educator, and leader with over a decade of experience in business, education, and community service. This project showcases the professional milestones, leadership roles, and achievements of Mubarak Mehdi — Founder & CEO of Mubarak Group of Hostels and multiple ventures across Pakistan. From educational roots to entrepreneurial excellence and social activism, this is a journey of dedication, discipline, and growth.",
  quote:
    "From educational roots to entrepreneurial excellence and social activism — this is a journey of dedication, discipline, and growth.",
  email: "mubarakgroupofhostels@gmail.com",
  phone: "0302 9272481",
};

export type TeamMember = {
  name: string;
  role: string;
  photo: string;
  email?: string;
  phone?: string;
  hostel?: string;
};

export const leadership: TeamMember[] = [
  {
    name: "Usama Rafiq",
    role: "Digital Marketing Manager",
    photo: usamaPhoto,
    email: "usamarafiq276@gmail.com",
    phone: "0302 9272481",
  },
  {
    name: "Badar Mahmood",
    role: "Mess Manager",
    hostel: "Jinnah House",
    photo: badarPhoto,
    email: "badarmahmood823@gmail.com",
    phone: "+92 313 0591478",
  },
  {
    name: "Quaid Lucky",
    role: "Night Manager",
    hostel: "SAMA House",
    photo: quaidPhoto,
    email: "qaidhussain121321@gmail.com",
    phone: "+92 309 9745945",
  },
];

export type Warden = {
  name: string;
  hostelId: number;
  hostelName: string;
  phone: string;
  email: string;
  photo: string;
  role: string;
};

export const wardens: Warden[] = [
  {
    name: "Yousaf Mehsood",
    hostelId: 1,
    hostelName: "Jinnah House",
    phone: "03419715017",
    email: "yousafmehsood2121@gmail.com",
    role: "Manager, Jinnah House",
    photo: yousafPhoto,
  },
  {
    name: "Abdullah",
    hostelId: 2,
    hostelName: "SAMA House",
    phone: "03105948138",
    email: "malikabdullahmalikaz@gmail.com",
    role: "Manager, SAMA House",
    photo: abdullahPhoto,
  },
  {
    name: "Bilah Ahmed",
    hostelId: 3,
    hostelName: "Dr. Abdul Qadeer Khan House",
    phone: "03045889984",
    email: "bilalsudais74@gmail.com",
    role: "Manager, Dr. Abdul Qadeer Khan House",
    photo: bilalPhoto,
  },
];
