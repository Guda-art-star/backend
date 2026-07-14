# 🎓 St. John's College Mpigi - Django Website Management & Administration Backend

Welcome to the **St. John's College Mpigi (SJC)** backend. This workspace is beautifully designed and built exclusively with **Django 4.2+** and **Bootstrap 5 / Tailwind-inspired aesthetics**. It serves as a secure, feature-rich content management platform and an interactive admissions gateway for our administrative staff and school registrars.

---

## ✨ Features & Capabilities

- **🔐 Robust Django Control Panel**: Custom styled Django admin titles, brand colors, custom fields, data-filters, advanced search, and inline-list editing attributes.
- **📑 Online Student Admission Registry**: Complete application workflow handling bio-demographics, parent contacts, academic metrics (PLE aggregates, UCE grades), and file uploads (result certificates and headteacher letters).
- **💸 Automated Escrow Fee Handling**: Automatic transaction reference generation (`STJ-APP-XXXXXX`) with custom biller instructions for MTN Mobile Money, Airtel Money, Centenary Bank, and Stanbic Bank. It includes an interactive **Payment Simulator** to verify and clear applications instantly in SQLite tables.
- **📢 Active Bulletin & Circular Boards**: Quick publishing of newsletters and circulars categorised by academic, sports, general, or admission announcements.
- **📅 Interactive School Calendar**: Live schedule tables storing times, assembly venues, entry costs, and cover flyer images.
- **🎓 Moderated Alumni Registry**: Digital directory connecting graduates of SJC, featuring senior memory notes, quotes, profession logs, and approved profile photos.
- **❓ Categorised FAQ Accordeons**: Collapsible, fast-loading FAQ items grouping registration schedules, boarding rules, and fees structures.
- **🔄 Synchronisation APIs**: Fast REST-like JSON interfaces allowing the primary frontend application to seamlessly load live events and announcements data.

---

## 📂 Folder Structure

```text
/backend/
│
├── manage.py                     # Django CLI command line entry point
├── requirements.txt              # Django, Pillow, and styling requirements
├── db.sqlite3                    # Local secure relational SQL database file
│
├── st_johns_college/             # Project main core configuration
│   ├── __init__.py
│   ├── settings.py               # Database, static directories, media uploads settings
│   ├── urls.py                   # Master routing and static/media debug paths
│   ├── wsgi.py
│   └── asgi.py
│
├── website/                      # SJC core application
│   ├── __init__.py
│   ├── apps.py                   # Verbose app registration configurations
│   ├── models.py                 # Fully documented data models (Admissions, Events, Alumni, FAQs, Hero)
│   ├── admin.py                  # Bespoke Django Admin layouts, lists, and actions
│   ├── forms.py                  # Beautiful ModelForms integrated with Bootstrap 5
│   ├── views.py                  # Standard layouts and JSON API integrations
│   └── urls.py                   # Application specific paths
│
└── templates/                    # Custom Bootstrap 5 base templates
    ├── base.html                 # Main master layout carrying navbar and footers
    └── website/
        ├── index.html            # Admin dashboard and carousels
        ├── apply_online.html     # Admissions registration form
        ├── payment_checkout.html # Simulated biller checkout & payment simulator
        ├── receipt.html          # Printable payment confirmation receipt
        ├── alumni_board.html     # Networking board and submission forms
        └── faq.html              # Collapsible accordion FAQs
```

---

## 🚀 Step-by-Step Local Setup & Execution Guide

To boot up and view this beautifully crafted Django backend, complete these steps inside your terminal:

### 1. Create and Activate a Python Virtual Environment

Navigate into your project folder and establish a virtual env to keep dependencies isolated:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Required Dependencies

Install Django, Pillow, and crispy form packages:

```bash
pip install -r backend/requirements.txt
```

### 3. Apply Schema Migrations

Apply database structures and create your SQLite tables instantly:

```bash
python backend/manage.py makemigrations website
python backend/manage.py migrate
```

### 4. Create an Administrator Superuser Account

Run the command below to provision your credentials for the **Django Control Panel**:

```bash
python backend/manage.py createsuperuser
```
*(Enter your username, email, and password as prompted).*

### 5. Start the Development Server

Launch the backend web server:

```bash
python backend/manage.py runserver
```

---

## 🕹️ Navigating the Interfaces

- **SJC Visitor Portal**: Access `http://127.0.0.1:8000/` to test online registrations, submit mock applications, review billing checkouts, print payment receipts, read FAQs, and submit alumni cards.
- **SJC Admin Control Panel**: Head over to `http://127.0.0.1:8000/admin/` and login with your superuser credentials. Enjoy a fully customized, beautifully branded SJC environment where you can audit registrations, approve alumni profiles, verify fees, and post announcements!
