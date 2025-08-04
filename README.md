eTrack Property Management System
Overview
eTrack is a comprehensive Property Management System designed for educational institutions to efficiently track and manage electrical assets across campus facilities. The system supports inventory management, real-time status tracking, defect reporting, and automated notifications, ensuring seamless operations for administrators, floor in-charges, and students. Key features include barcode scanning, dynamic floor management, and a student complaint interface for reporting issues with devices like monitors, keyboards, and air conditioners.
Features

Inventory Management: Track electrical items (e.g., Monitors, Keyboards, Mice, Fans, Lights, Wi-Fi Routers, Air Conditioners) with details on quantity, working status, and defects.
Barcode Scanning: Scan barcodes to quickly retrieve and update item details, integrated into the Hero component with inline camera feed and product details modal.
Dynamic Floor Management: Add and manage floors dynamically, allowing flexible configuration of campus layouts.
Student Complaint Component: A user-friendly interface for students to report issues via a multi-step form, featuring dropdowns for floor, wing, room, and device selection, styled with glassmorphism and Tailwind CSS.
Real-Time Notifications: Instant alerts for defective items, sent to the IT team for timely resolution.
Email Notifications: Automated email reports for inventory status and defect updates.
Admin Dashboard: Centralized interface for inventory overview, building map, item filtering, and data visualization using bar graphs and pie charts (powered by Chart.js).
Floor In-Charge UI: Dedicated interface for floor-specific management and issue tracking.
Responsive Design: Fully responsive UI with a futuristic dark theme, using charcoal black backgrounds, cool blue/neon green accents, and fonts like Orbitron or Titillium Web.

Tech Stack

Frontend: React.js, JavaScript, Tailwind CSS, Chart.js, React Router, CSS Modules, Three.js (for 3D animations in the student UI)
Backend: Node.js, Express.js
Database: MongoDB
Additional Tools: GitHub, Vercel, Visual Studio Code, Material UI, Supabase (for authentication), Canva, Figma

Installation

Clone the Repository:
git clone https://github.com/your-repo/etrack.git
cd etrack


Backend Setup:

Navigate to the backend directory: cd backend
Install dependencies: npm install
Create a .env file with the following:MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
EMAIL_SERVICE=your_email_service_credentials


Start the backend server: npm start


Frontend Setup:

Navigate to the frontend directory: cd frontend
Install dependencies: npm install
Start the development server: npm run dev


Database Configuration:

Ensure MongoDB is running locally or use a cloud-based MongoDB instance (e.g., MongoDB Atlas).
Update the MONGO_URI in the .env file with your database connection string.


Running the Application:

Access the application at http://localhost:5173 (or the port specified by your frontend setup).
Ensure the backend server is running concurrently (default: http://localhost:5000).

Usage

Admin Access: Log in to the Admin Dashboard to manage inventory, view analytics, and filter items by status or location.
Floor In-Charge Access: Use the Floor In-Charge UI to monitor and update floor-specific assets.
Student Access: Navigate to the student complaint component to report issues with devices. Select floor, wing, room, and device from dropdowns, and submit the complaint for IT team review.
Barcode Scanning: Use the Hero component’s search input or barcode scanner to retrieve item details instantly.

Contributing

Fork the repository.
Create a feature branch: git checkout -b feature-name
Commit your changes: git commit -m "Add feature-name"
Push to the branch: git push origin feature-name
Submit a pull request.

Future Scope

Integrate IoT sensors for real-time device monitoring.
Add multi-language support for broader accessibility.
Enhance analytics with predictive maintenance algorithms.
Implement offline capabilities for the student complaint form.

License
This project is licensed under the MIT License.
