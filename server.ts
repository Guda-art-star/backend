import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Set EJS view engine and directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Simple Custom Cookie Parser Middleware
app.use((req, res, next) => {
  const cookies = req.headers.cookie;
  const cookieMap: Record<string, string> = {};
  if (cookies) {
    cookies.split(";").forEach(c => {
      const parts = c.trim().split("=");
      if (parts.length === 2) {
        cookieMap[parts[0]] = parts[1];
      }
    });
  }
  (req as any).cookies = cookieMap;
  next();
});

// Set up public upload directory (static assets)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({ storage });

// Session messages simulator (in-memory per-client simple flash messages queue)
// For our single-user environment, we can manage global flash messages or simulate them in local state.
let systemMessages: { type: string; text: string }[] = [];

function addMessage(type: string, text: string) {
  systemMessages.push({ type, text });
}

function getAndClearMessages() {
  const msgs = [...systemMessages];
  systemMessages = [];
  return msgs;
}

// IN-MEMORY DATA SEEDS (Fulfilling "durable local in-memory modeling")
let heroConfig = {
  badge: "ACADEMIC DISTINCTION",
  title: "Godliness and Hardwork Since 2004",
  description: "Providing high-standard secondary education that empowers children to excel globally.",
  primaryBtnText: "DISCOVER MORE",
  primaryBtnLink: "/about-us",
  secondaryBtnText: "APPLY NOW",
  secondaryBtnLink: "/apply",
  status: "published",
  lastUpdated: "May 21, 2026, 10:30 AM",
  updatedBy: "Admin",
  images: [
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000",
    "https://images.unsplash.com/photo-1562774053-4ab0064abb3c?q=80&w=1000",
    "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1000",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1000"
  ]
};

let heroSlides = [
  {
    id: 1,
    title: heroConfig.title,
    subtitle: heroConfig.description,
    image: heroConfig.images[0],
    order: 1,
    is_active: heroConfig.status === "published"
  },
  {
    id: 2,
    title: "Unrivalled Scientific Exploration",
    subtitle: "We possess state-of-the-art laboratory equipment to boost chemical, physics, and biological practical learning.",
    image: "https://images.unsplash.com/photo-1562774053-4ab0064abb3c?q=80&w=1000",
    order: 2,
    is_active: true
  },
  {
    id: 3,
    title: "Co-curricular Leadership",
    subtitle: "Nurturing professional sports players, debate leaders, and musical virtuosos across Uganda.",
    image: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1000",
    order: 3,
    is_active: true
  }
];

let keyPillars = [
  {
    id: 1,
    title: "Academic Rigor",
    icon_name: "book-half",
    description: "Exceptional UNEB performance rankings year-over-year in both O-level and A-level examinations.",
    bg_color: "bg-sky-50",
    order: 1
  },
  {
    id: 2,
    title: "Spiritual Molding",
    icon_name: "shield-check",
    description: "Daily chapel, values-driven assemblies, and guidance counselors to cultivate upright morals.",
    bg_color: "bg-emerald-50",
    order: 2
  },
  {
    id: 3,
    title: "Co-Curriculars",
    icon_name: "trophy-fill",
    description: "Award-winning football, basketball, athletics, music, dance, and drama assemblies.",
    bg_color: "bg-amber-50",
    order: 3
  },
  {
    id: 4,
    title: "Vast Infrastructure",
    icon_name: "building",
    description: "Advanced ICT labs, expansive libraries, modern dormitories, and self-sufficient school farms.",
    bg_color: "bg-info bg-opacity-10",
    order: 4
  }
];

let announcements = [
  {
    id: 1,
    title: "End of Term One circular to SJC parents & guardians",
    category: "General Circular",
    date: "2026-06-20",
    excerpt: "All student report cards, holiday package circulars, and term two requirements are ready for retrieval.",
    content: "Dear Parents and Guardians of St. John's College Mpigi. We thank God for a highly successful and blessed Term One. We have officially released report cards, UNEB assessment progress sheets, and term requirements dossiers. Please pick yours up from the school registrar desk, or download from the digital portal.",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600",
    is_active: true
  },
  {
    id: 2,
    title: "Senior One National Placement & Intake Guidelines 2026",
    category: "Admissions",
    date: "2026-07-01",
    excerpt: "Detailed instructions on PLE aggregates limits, file vetting slots, and placement deposit timelines.",
    content: "The Admissions Board of SJC Mpigi announces that the primary vetting window for Senior One is now open. Cut-off points are set at Best-4 aggregate score of 12 for males and 14 for females. Standard application handling fee remains 50,000 UGX, cleared securely via the escrow portal.",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600",
    is_active: true
  },
  {
    id: 3,
    title: "SJC Mpigi emerges champions of Mpigi District Athletics Gala",
    category: "Sports",
    date: "2026-07-10",
    excerpt: "Our outstanding athletics squad bagged 14 gold medals and qualified for the national championships.",
    content: "St. John's College Mpigi athletics team put up an outstanding display at the Mpigi District Athletics Gala yesterday, bagging 14 Gold medals, 8 Silver medals, and 4 Bronze medals. Our sprint cohort qualified for the Uganda National Secondary Schools Athletics finals scheduled for next month in Gulu.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600",
    is_active: true
  }
];

let schoolEvents = [
  {
    id: 1,
    title: "SJC Annual Inter-House Sports Gala",
    category: "Sports & Games",
    date: "2026-07-25",
    time: "8:00 AM - 5:30 PM",
    location: "Main Sports Grounds, Mpigi",
    cost: "Free Entry",
    description: "The ultimate inter-house athletic competition! Cheer your houses (Lwanga, Gonzaga, Mulumba, Kizito) in track, hurdles, and field operations.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600",
    is_active: true
  },
  {
    id: 2,
    title: "Term Two Visitation Day & Mid-Term Assembly",
    category: "Social & Charity",
    date: "2026-08-09",
    time: "9:00 AM - 4:00 PM",
    location: "Main School Quadrangle",
    cost: "Free Entry",
    description: "Welcome back parents and guardians to interact with teachers, inspect academic files, and visit student dormitories.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600",
    is_active: true
  },
  {
    id: 3,
    title: "O-level and A-level Candidates Mock Exams",
    category: "Academics & Tests",
    date: "2026-08-17",
    time: "8:30 AM - 4:30 PM",
    location: "SJC Main Exam Center",
    cost: "Included in Fees",
    description: "Rigorous preparatory examinations aligned precisely with UNEB O-Level and A-Level standards to prepare candidates for success.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600",
    is_active: true
  }
];

let admissions = [
  {
    application_id: "721a99a7-86f7-41ec-b28a-7cfbfd92d4f3",
    first_name: "John",
    last_name: "Ssewankambo",
    date_of_birth: "2012-05-14",
    gender: "male",
    previous_school: "Kireka Grammar Primary School",
    class_applied: "S1",
    parent_name: "Robert Mukasa",
    parent_phone: "+256772123456",
    parent_email: "robert.mukasa@gmail.com",
    parent_address: "Kireka, Kampala",
    ple_aggregates: 6,
    uce_division: "",
    result_slip_file: "",
    recommendation_file: "",
    application_fee_ugx: 50000,
    payment_method: "mtn",
    payment_phone: "+256772123456",
    payment_reference: "STJ-APP-540291",
    payment_status: "paid",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  {
    application_id: "8c12fa33-5c81-42cb-b1b7-a3f12ef9e313",
    first_name: "Sarah",
    last_name: "Namaganda",
    date_of_birth: "2010-09-18",
    gender: "female",
    previous_school: "St. Agnes Primary School",
    class_applied: "S3",
    parent_name: "Elizabeth Nabakooza",
    parent_phone: "+256701890123",
    parent_email: "elizabeth.naba@yahoo.com",
    parent_address: "Mpigi Town",
    ple_aggregates: 10,
    uce_division: "",
    result_slip_file: "",
    recommendation_file: "",
    application_fee_ugx: 50000,
    payment_method: "airtel",
    payment_phone: "+256701890123",
    payment_reference: "STJ-APP-329481",
    payment_status: "pending",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    application_id: "52be5384-cd9d-435c-8973-19ebcc4a66a3",
    first_name: "Timothy",
    last_name: "Kato",
    date_of_birth: "2009-02-12",
    gender: "male",
    previous_school: "Greenhill Academy",
    class_applied: "S5_SCI",
    parent_name: "Joseph Kato",
    parent_phone: "+256781223344",
    parent_email: "jkato@greenhill.ac.ug",
    parent_address: "Muyenga, Kampala",
    ple_aggregates: null,
    uce_division: "Division 1, 14 Aggregates",
    result_slip_file: "",
    recommendation_file: "",
    application_fee_ugx: 50000,
    payment_method: "centenary",
    payment_phone: "",
    payment_reference: "STJ-APP-859203",
    payment_status: "paid",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  }
];

let alumniList = [
  {
    id: 1,
    name: "Dr. Ronald Mutebi",
    graduation_year: 2012,
    current_profession: "Medical Officer at Mulago Hospital",
    quote: "St. John's College taught me that godliness is the root of all service.",
    memory_text: "I remember our long pre-exam night reading under candlelight when power went out, and Father Augustine's daily blessings before assemblies.",
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200",
    is_approved: true,
    created_at: new Date()
  },
  {
    id: 2,
    name: "Arthur Ssenyange",
    graduation_year: 2015,
    current_profession: "Senior Software Engineer at Safaricom",
    quote: "Godliness & Hardwork is the blueprint. SJC molded my career path.",
    memory_text: "Setting up our school's first basic coding assembly in the computer laboratory was the spark that led to my professional programming career.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    is_approved: true,
    created_at: new Date()
  },
  {
    id: 3,
    name: "Joan Nakafeero",
    graduation_year: 2018,
    current_profession: "Accountant at Stanbic Bank Uganda",
    quote: "The discipline we acquired at SJC Mpigi is unmatched globally.",
    memory_text: "Unbeatable sports day athletic sprints, and winning the debate trophy for the region under Kizito house banner represent my best school days.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200",
    is_approved: true,
    created_at: new Date()
  },
  {
    id: 4,
    name: "Deus Kamwesiga",
    graduation_year: 2020,
    current_profession: "Civil Engineering Researcher at Makerere",
    quote: "Hard work without godliness is empty; SJC showed me the right path.",
    memory_text: "Building the miniature wooden model bridges in our design assemblies sparked my ultimate passion for civil engineering structure research.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
    is_approved: false, // Pending moderation approval
    created_at: new Date()
  }
];

let faqItems = [
  {
    id: 1,
    question: "What are the requirements for S.1 Admission entry?",
    answer: "We require a Primary Leaving Examinations (PLE) result slip showing a Best 4 aggregate score of 12 for boys and 14 for girls. Parents must clear the non-refundable handling escrow fee of 50,000 UGX on our application portal to initiate registrars' files vetting.",
    category: "Academics & Registration",
    order: 1
  },
  {
    id: 2,
    question: "What boarding facilities and student welfare are available?",
    answer: "St. John's College provides comprehensive separated boys and girls modern hostels with active warden surveillance. Safe filtered clean boreholes, a professional school sanatorium staffed by registered medical officers, and balanced daily student diet menus are fully active.",
    category: "Boarding & Student Welfare",
    order: 2
  },
  {
    id: 3,
    question: "How do I clear the admission Handling Fee securely?",
    answer: "Select your preferred payment gateway on our admission registration form (e.g. MTN MoMo, Airtel Money, Centenary Bank, Stanbic). A unique escrow reference number is generated for your student's dossier. Initiate transfer or Mobile Money USSD with the exact reference as narrative narrative to secure instant automated payment clearing.",
    category: "Admissions & Fees",
    order: 1
  },
  {
    id: 4,
    question: "Are school visits allowed during term time?",
    answer: "Parents are strictly requested to visit only during our officially designated mid-term Visitation Days (generally Sunday on week 7). Emergency medical visits or administrative inquiries should be coordinated via the Deputies' or Registrars' desks.",
    category: "General Inquiries",
    order: 1
  }
];

let staffMembers = [
  {
    id: 1,
    name: "Rev. Fr. Augustine Ssekate",
    role: "Headteacher & Principal Director",
    category: "Administration",
    email: "principal.ssekate@stjohnscollegempigi.ac.ug",
    phone: "+256772104920",
    bio: "Dedicated minister and educationist with over 18 years of secondary administration. Committed to molding upright, disciplined leaders under Godliness.",
    photo: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=300",
    order: 1,
    is_active: true
  },
  {
    id: 2,
    name: "Mrs. Justine Nakalema",
    role: "Deputy Headteacher - Academics",
    category: "Administration",
    email: "academics.nakalema@stjohnscollegempigi.ac.ug",
    phone: "+256702334455",
    bio: "An accomplished educator of chemistry and biology. Oversees SJC academic programs, exam schedules, and UNEB standards audit directories.",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300",
    order: 2,
    is_active: true
  },
  {
    id: 3,
    name: "Mr. Mukasa John",
    role: "Head of Chemistry & A-level Coordinator",
    category: "Teaching Staff",
    email: "jmukasa@stjohnscollegempigi.ac.ug",
    phone: "+256782110022",
    bio: "Passionate chemistry master helping student researchers explore molecular compounds and practical lab experiments for over 9 candid academic terms.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
    order: 1,
    is_active: true
  },
  {
    id: 4,
    name: "Miss Brenda Nanteza",
    role: "Head of English & Literature assembly",
    category: "Teaching Staff",
    email: "bnanteza@stjohnscollegempigi.ac.ug",
    phone: "+256752990011",
    bio: "Fostering creative literature compositions, speech rhetoric training, and premium student debates across national high school assemblies.",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300",
    order: 2,
    is_active: true
  },
  {
    id: 5,
    name: "Sister Mary Agnes Kigozi",
    role: "Senior Dormitory Warden & Guidance Counselor",
    category: "Support Staff / Allied Staff",
    email: "agnes.kigozi@stjohnscollegempigi.ac.ug",
    phone: "+256774902010",
    bio: "Ensuring student hostels welfare, moral counseling guidance sessions, and daily chapel coordination for female cohorts at SJC.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300",
    order: 1,
    is_active: true
  }
];

let smsCampaigns = [
  {
    id: 1,
    campaign_name: "Term Two Fees Reminder circular",
    message_content: "SJC Mpigi Circular: Dear Parents, term 2 begins on 12th Sept. Ensure at least 50% fees payment clear bank escrow before return date. Godliness & Hardwork.",
    recipient_type: "all_parents",
    total_recipients: 420,
    sent_count: 418,
    failed_count: 2,
    status: "sent",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    campaign_name: "Sports Gala Assembly postponement Notice",
    message_content: "Notice: Annual inter-house athletic gala has been rescheduled to Saturday 25th July due to weather. All parent visitors are welcome. SJC Admin.",
    recipient_type: "all_students",
    total_recipients: 680,
    sent_count: 680,
    failed_count: 0,
    status: "sent",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  }
];

// AUTHENTICATION ROUTES
app.get("/login", (req, res) => {
  if ((req as any).cookies && (req as any).cookies.admin_session === "logged_in") {
    return res.redirect("/admin");
  }
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (
    (email === "admin.sjc@mpigi.ac.ug" || email === "admin") &&
    (password === "admin123" || password === "password")
  ) {
    res.setHeader("Set-Cookie", "admin_session=logged_in; Path=/; HttpOnly; SameSite=Strict");
    return res.redirect("/admin");
  } else {
    res.render("login", { error: "Invalid administrative email or security password." });
  }
});

app.get("/logout", (req, res) => {
  res.setHeader("Set-Cookie", "admin_session=; Path=/; Max-Age=0");
  res.redirect("/login");
});

// PORTAL PUBLIC FRONTEND ROUTING
app.get("/", (req, res) => {
  if ((req as any).cookies && (req as any).cookies.admin_session === "logged_in") {
    res.redirect("/admin");
  } else {
    res.redirect("/login");
  }
});

app.get("/website", (req, res) => {
  if ((req as any).cookies && (req as any).cookies.admin_session === "logged_in") {
    res.redirect("/admin");
  } else {
    res.redirect("/login");
  }
});

app.get("/website/home-dashboard", (req, res) => {
  // Simple stats summary
  const stats = {
    total_admissions: admissions.length,
    paid_admissions: admissions.filter(a => a.payment_status === "paid").length,
    pending_admissions: admissions.filter(a => a.payment_status === "pending").length,
    registered_alumni: alumniList.filter(a => a.is_approved).length,
    active_news: announcements.filter(a => a.is_active).length,
    upcoming_events: schoolEvents.filter(e => e.is_active).length,
    total_staff: staffMembers.filter(s => s.is_active).length
  };

  // 7-Day Trend calculations (simulate last 7 days of traffic)
  const daily_trends = [];
  const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const day_name = `${daysShort[d.getDay()]}, ${monthsShort[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
    
    // Count actual admissions on this date
    const count = admissions.filter(a => {
      const appDate = new Date(a.created_at);
      return appDate.getDate() === d.getDate() && appDate.getMonth() === d.getMonth();
    }).length;

    const simulated_visits = 110 + ((d.getDate() * 13) % 60) + count * 8;
    daily_trends.push({
      day: day_name,
      admissions: count,
      visits: simulated_visits
    } as never);
  }

  res.render("website/index", {
    slides: heroSlides.filter(s => s.is_active),
    pillars: keyPillars,
    announcements: announcements.filter(a => a.is_active).slice(0, 3),
    events: schoolEvents.filter(e => e.is_active).slice(0, 3),
    stats,
    daily_trends,
    messages: getAndClearMessages()
  });
});

app.get("/website/apply-online", (req, res) => {
  res.render("website/apply_online", {
    messages: getAndClearMessages()
  });
});

app.post("/website/apply-online", upload.fields([
  { name: "result_slip_file", maxCount: 1 },
  { name: "recommendation_file", maxCount: 1 }
]), (req, res) => {
  const body = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const application_id = uuidv4();
  const rand_code = Math.floor(100000 + Math.random() * 900000);
  const payment_reference = `STJ-APP-${rand_code}`;

  const newApp = {
    application_id,
    first_name: body.first_name,
    last_name: body.last_name,
    date_of_birth: body.date_of_birth,
    gender: body.gender,
    previous_school: body.previous_school,
    class_applied: body.class_applied,
    parent_name: body.parent_name,
    parent_phone: body.parent_phone,
    parent_email: body.parent_email || "",
    parent_address: body.parent_address,
    ple_aggregates: body.ple_aggregates ? parseInt(body.ple_aggregates) : null,
    uce_division: body.uce_division || "",
    result_slip_file: files && files["result_slip_file"] ? `/uploads/${files["result_slip_file"][0].filename}` : "",
    recommendation_file: files && files["recommendation_file"] ? `/uploads/${files["recommendation_file"][0].filename}` : "",
    application_fee_ugx: 50000,
    payment_method: body.payment_method,
    payment_phone: body.payment_phone || "",
    payment_reference,
    payment_status: "pending",
    created_at: new Date()
  };

  admissions.unshift(newApp);

  addMessage("success", `Application for ${newApp.first_name} has been received! Please verify escrow payment below to complete.`);
  res.redirect(`/website/apply-online/checkout/${application_id}`);
});

app.get("/website/apply-online/checkout/:application_id", (req, res) => {
  const application_id = req.params.application_id;
  const application = admissions.find(a => a.application_id === application_id);

  if (!application) {
    addMessage("danger", "Requested application dossier was not found.");
    return res.redirect("/website/apply-online");
  }

  // Retrieve instructions based on payment gateway selections
  const instMap: { [key: string]: { code: string; biller_name: string } } = {
    mtn: {
      code: "*165*4*4# (Merchant Code: 620459)",
      biller_name: "St. John's College - Application Escrow"
    },
    airtel: {
      code: "*185*9# (Biller ID: 1120492)",
      biller_name: "St. John's College Mpigi Collection"
    },
    centenary: {
      code: "310004928104 (Centenary Bank)",
      biller_name: "ST. JOHNS COLLEGE MPIGI - FEES"
    },
    stanbic: {
      code: "903001859204 (Stanbic Bank)",
      biller_name: "ST. JOHNS COLLEGE MPIGI MAIN"
    }
  };

  const biller_instructions = instMap[application.payment_method] || {
    code: "N/A",
    biller_name: "St. John's College Main Escrow"
  };

  res.render("website/payment_checkout", {
    application,
    biller_instructions,
    messages: getAndClearMessages()
  });
});

app.post("/website/apply-online/checkout/:application_id", (req, res) => {
  const application_id = req.params.application_id;
  const application = admissions.find(a => a.application_id === application_id);

  if (!application) {
    addMessage("danger", "Requested application dossier was not found.");
    return res.redirect("/website/apply-online");
  }

  // Simulate gateway instantly clearing payment inside SQLite in-memory tables
  application.payment_status = "paid";
  addMessage("success", "🎉 Escrow payment verified and application fully cleared!");
  res.redirect(`/website/apply-online/receipt/${application_id}`);
});

app.get("/website/apply-online/receipt/:application_id", (req, res) => {
  const application_id = req.params.application_id;
  const application = admissions.find(a => a.application_id === application_id);

  if (!application) {
    addMessage("danger", "Requested receipt not found.");
    return res.redirect("/website");
  }

  res.render("website/receipt", {
    app: application,
    messages: getAndClearMessages()
  });
});

app.get("/website/alumni-board", (req, res) => {
  res.render("website/alumni_board", {
    alumni_list: alumniList.filter(a => a.is_approved),
    messages: getAndClearMessages()
  });
});

app.post("/website/alumni-board", upload.single("photo"), (req, res) => {
  const body = req.body;
  const file = req.file;

  const newAlumnus = {
    id: alumniList.length + 1,
    name: body.name,
    graduation_year: parseInt(body.graduation_year),
    current_profession: body.current_profession || "",
    quote: body.quote || "",
    memory_text: body.memory_text || "",
    photo: file ? `/uploads/${file.filename}` : "",
    is_approved: false, // moderation required
    created_at: new Date()
  };

  alumniList.unshift(newAlumnus);

  addMessage("success", "Thank you! Your profile has been sent to the administrator for moderation approval.");
  res.redirect("/website/alumni-board");
});

app.get("/website/faqs", (req, res) => {
  // Map our categories:
  const categories = [
    { key: "Academics & Registration", label: "Academics & Registration" },
    { key: "Boarding & Student Welfare", label: "Boarding & Student Welfare" },
    { key: "Admissions & Fees", label: "Admissions & Fees" },
    { key: "General Inquiries", label: "General Inquiries" }
  ];

  const categorized_faqs: { [key: string]: any[] } = {};
  categories.forEach(cat => {
    const items = faqItems.filter(f => f.category === cat.key);
    if (items.length > 0) {
      categorized_faqs[cat.label] = items;
    }
  });

  res.render("website/faq", {
    categorized_faqs,
    messages: getAndClearMessages()
  });
});

app.get("/website/staff-directory", (req, res) => {
  const categories = [
    { key: "Administration", label: "Administration" },
    { key: "Teaching Staff", label: "Teaching Staff" },
    { key: "Support Staff / Allied Staff", label: "Support Staff / Allied Staff" }
  ];

  const categorized_staff: { [key: string]: any[] } = {};
  categories.forEach(cat => {
    const items = staffMembers
      .filter(s => s.category === cat.key && s.is_active)
      .sort((a, b) => a.order - b.order);
    if (items.length > 0) {
      categorized_staff[cat.label] = items;
    }
  });

  res.render("website/staff_directory", {
    categorized_staff,
    messages: getAndClearMessages()
  });
});

// JSON API ENDPOINTS FULFILLING "REST-like JSON APIs"
app.get("/website/api/announcements", (req, res) => {
  res.json({
    status: "success",
    data: announcements.filter(a => a.is_active).map(a => ({
      title: a.title,
      category: a.category,
      date: a.date,
      excerpt: a.excerpt,
      image_url: a.image || null
    }))
  });
});

app.get("/website/api/events", (req, res) => {
  res.json({
    status: "success",
    data: schoolEvents.filter(e => e.is_active).map(e => ({
      title: e.title,
      category: e.category,
      date: e.date,
      time: e.time,
      location: e.location,
      cost: e.cost,
      description: e.description,
      image_url: e.image || null
    }))
  });
});

app.get("/website/api/staff", (req, res) => {
  res.json({
    status: "success",
    data: staffMembers.filter(s => s.is_active).map(s => ({
      name: s.name,
      role: s.role,
      category: s.category,
      email: s.email,
      phone: s.phone,
      bio: s.bio,
      photo_url: s.photo || null
    }))
  });
});

// CONTROL PANEL MOCK ADMIN ROUTING
// Middleware to protect all /admin routes
app.use("/admin", (req, res, next) => {
  if ((req as any).cookies && (req as any).cookies.admin_session === "logged_in") {
    next();
  } else {
    res.redirect("/login");
  }
});

app.get("/admin", (req, res) => {
  const currentTab = req.query.tab || "hero_section";
  res.render("admin", {
    currentTab,
    admissions,
    alumni: alumniList,
    announcements,
    events: schoolEvents,
    staff: staffMembers,
    faqs: faqItems,
    smsCampaigns,
    heroConfig,
    messages: getAndClearMessages()
  });
});

app.post("/admin/hero-section/save", (req, res) => {
  const body = req.body;
  heroConfig.badge = body.badge || "";
  heroConfig.title = body.title || "";
  heroConfig.description = body.description || "";
  heroConfig.primaryBtnText = body.primaryBtnText || "";
  heroConfig.primaryBtnLink = body.primaryBtnLink || "";
  heroConfig.secondaryBtnText = body.secondaryBtnText || "";
  heroConfig.secondaryBtnLink = body.secondaryBtnLink || "";
  heroConfig.status = body.status || "published";
  
  // Format current date nicely
  const d = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedDate = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}, ${String(d.getHours() % 12 || 12).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
  
  heroConfig.lastUpdated = formattedDate;
  heroConfig.updatedBy = "Admin";
  
  // Update images if we have them
  if (body.images) {
    if (Array.isArray(body.images)) {
      heroConfig.images = body.images;
    } else if (typeof body.images === "string") {
      heroConfig.images = [body.images];
    }
  }
  
  // Update the first carousel slide in sync
  if (heroSlides[0]) {
    heroSlides[0].title = heroConfig.title;
    heroSlides[0].subtitle = heroConfig.description;
    heroSlides[0].image = heroConfig.images[0] || heroSlides[0].image;
    heroSlides[0].is_active = heroConfig.status === "published";
  }
  
  addMessage("success", "Hero Section updated successfully and live on the homepage!");
  res.redirect("/admin?tab=hero_section");
});

// Admin Admissions Operations
app.post("/admin/admissions/approve/:id", (req, res) => {
  const id = req.params.id;
  const appItem = admissions.find(a => a.application_id === id);
  if (appItem) {
    appItem.payment_status = "paid";
    addMessage("success", `Escrow payment for ${appItem.first_name} ${appItem.last_name} manually cleared and approved!`);
  }
  res.redirect("/admin?tab=admissions");
});

app.post("/admin/admissions/delete/:id", (req, res) => {
  const id = req.params.id;
  admissions = admissions.filter(a => a.application_id !== id);
  addMessage("success", "Admission application deleted successfully.");
  res.redirect("/admin?tab=admissions");
});

// Admin Alumni Operations
app.post("/admin/alumni/toggle/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const alumn = alumniList.find(a => a.id === id);
  if (alumn) {
    alumn.is_approved = !alumn.is_approved;
    addMessage("success", `Alumni profile of ${alumn.name} is now ${alumn.is_approved ? 'APPROVED' : 'PENDING moderation'}.`);
  }
  res.redirect("/admin?tab=alumni");
});

app.post("/admin/alumni/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  alumniList = alumniList.filter(a => a.id !== id);
  addMessage("success", "Alumni registry profile deleted successfully.");
  res.redirect("/admin?tab=alumni");
});

// Admin Announcements Operations
app.post("/admin/announcements/add", (req, res) => {
  const body = req.body;
  const newNews = {
    id: announcements.length + 1,
    title: body.title,
    category: body.category,
    date: body.date,
    excerpt: body.excerpt,
    content: body.content || "",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600",
    is_active: true
  };
  announcements.unshift(newNews);
  addMessage("success", `Bulletin "${newNews.title}" has been successfully published!`);
  res.redirect("/admin?tab=announcements");
});

app.post("/admin/announcements/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  announcements = announcements.filter(a => a.id !== id);
  addMessage("success", "Bulletin announcement successfully deleted.");
  res.redirect("/admin?tab=announcements");
});

// Admin Events Operations
app.post("/admin/events/add", (req, res) => {
  const body = req.body;
  const newEv = {
    id: schoolEvents.length + 1,
    title: body.title,
    category: body.category,
    date: body.date,
    time: body.time,
    location: body.location,
    cost: body.cost,
    description: body.description || "",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600",
    is_active: true
  };
  schoolEvents.unshift(newEv);
  addMessage("success", `School event "${newEv.title}" scheduled successfully!`);
  res.redirect("/admin?tab=events");
});

app.post("/admin/events/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  schoolEvents = schoolEvents.filter(e => e.id !== id);
  addMessage("success", "Calendar event successfully deleted.");
  res.redirect("/admin?tab=events");
});

// Admin Staff Operations
app.post("/admin/staff/add", (req, res) => {
  const body = req.body;
  const newSt = {
    id: staffMembers.length + 1,
    name: body.name,
    role: body.role,
    category: body.category,
    email: body.email || "",
    phone: body.phone || "",
    bio: body.bio,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300",
    order: parseInt(body.order) || 1,
    is_active: true
  };
  staffMembers.push(newSt);
  addMessage("success", `Staff member "${newSt.name}" has been registered inside school directories!`);
  res.redirect("/admin?tab=staff");
});

app.post("/admin/staff/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  staffMembers = staffMembers.filter(s => s.id !== id);
  addMessage("success", "Staff profile deleted successfully.");
  res.redirect("/admin?tab=staff");
});

// Admin FAQs Operations
app.post("/admin/faqs/add", (req, res) => {
  const body = req.body;
  const newFaq = {
    id: faqItems.length + 1,
    question: body.question,
    answer: body.answer,
    category: body.category,
    order: parseInt(body.order) || 1
  };
  faqItems.push(newFaq);
  addMessage("success", "New FAQ item published successfully!");
  res.redirect("/admin?tab=faqs");
});

app.post("/admin/faqs/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  faqItems = faqItems.filter(f => f.id !== id);
  addMessage("success", "FAQ item successfully deleted.");
  res.redirect("/admin?tab=faqs");
});

// Admin SMS Campaigns Operations
app.post("/admin/sms/send", (req, res) => {
  const body = req.body;
  const recipient_type = body.recipient_type;
  
  // Determine recipient count based on selection
  let recipientsCount = 0;
  if (recipient_type === "all_parents") recipientsCount = 420;
  else if (recipient_type === "all_students") recipientsCount = 680;
  else if (recipient_type === "applicants") recipientsCount = admissions.length;
  else if (recipient_type === "s1") recipientsCount = admissions.filter(a => a.class_applied === "S1").length || 45;
  else if (recipient_type === "s4") recipientsCount = 75;
  else if (recipient_type === "s6") recipientsCount = 55;
  else {
    // Custom phone list split
    const nums = body.phone_numbers ? body.phone_numbers.split(",") : [];
    recipientsCount = nums.filter((n: string) => n.trim().length > 0).length || 1;
  }

  const newSms = {
    id: smsCampaigns.length + 1,
    campaign_name: body.campaign_name,
    message_content: body.message_content,
    recipient_type,
    total_recipients: recipientsCount,
    sent_count: recipientsCount,
    failed_count: 0,
    status: "sent",
    created_at: new Date()
  };

  smsCampaigns.unshift(newSms);
  addMessage("success", `Bulk SMS Campaign "${newSms.campaign_name}" successfully dispatched to ${recipientsCount} recipients!`);
  res.redirect("/admin?tab=sms");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[St. John's College Mpigi Administration Portal] running on port ${PORT}`);
});
