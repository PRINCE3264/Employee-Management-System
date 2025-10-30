🏢 Title:

Employee Management System — ASP.NET Core Web API (JWT Authentication) + Angular

📝Description:

This project is a full-stack Employee Management System built with ASP.NET Core Web API (backend) and Angular (frontend).
It includes secure JWT-based authentication and role-based access control for Admin and Employee users.

🔑 Key Features:

Authentication: Login & Register using ASP.NET Core Identity with JWT tokens

Role Management: Admin and Employee roles with protected routes

Departments: Add, Edit, Delete, and View department details

Employees: CRUD operations with linked user accounts and profile management

Leave Management:

Employees can apply or cancel leave

Admins can approve or reject leave requests

Attendance Module: Employees can mark attendance; Admins can view attendance reports

Angular Frontend: Responsive UI with Angular Material and Tailwind CSS

Secure API: Token-based authentication for all protected endpoints



⚙️ 1️⃣ Install Everything You Need
🟩 Step 1 — Install Visual Studio 2022

👉 Download & install from:
🔗 https://visualstudio.microsoft.com/downloads

During installation, select these workloads:

✅ “ASP.NET and web development”

✅ “.NET 8 SDK” (or latest)

✅ “Data storage and processing” (optional, for SQL Server tools)

🟦 Step 2 — Install SQL Server + SSMS

SQL Server → https://www.microsoft.com/en-us/sql-server/sql-server-downloads

SQL Server Management Studio (SSMS) → https://aka.ms/ssmsfullsetup

👉 After install, open SSMS → connect using:

Server Name: (local) or .\SQLEXPRESS
Authentication: Windows Authentication

🟨 Step 3 — Install Node.js (for Angular)

Go to
🔗 https://nodejs.org

and download LTS version (Recommended).

After install, open Command Prompt and check:

node -v
npm -v


✅ If you get version numbers, Node.js is installed correctly.

🟧 Step 4 — Install Angular CLI

Now install Angular globally:

npm install -g @angular/cli


Check version:

ng version


✅ You should see Angular CLI info.

🧩 2️⃣ Setup & Run Your Project
🟩 Step 1 — Clone Your Project

Open Command Prompt or PowerShell and run:

git clone https://github.com/PRINCE3264/Employee-Management-System434.git


Then go inside the folder:

cd Employee-Management-System434

🟦 Step 2 — Open in Visual Studio

Double-click the .sln file (like EmployeeManagementSystem.sln).

Visual Studio will open your project.

If it asks to restore NuGet packages, click Yes.

🟨 Step 3 — Set Up Database

In the ASP.NET API project, open appsettings.json.

Update the connection string:

"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=EmployeeDB;Trusted_Connection=True;MultipleActiveResultSets=True;"
}


Example:
"Server=DESKTOP-12345\\SQLEXPRESS;Database=EmployeeDB;Trusted_Connection=True;"

Open Package Manager Console (bottom of Visual Studio):

update-database


✅ This creates the database automatically.

🟧 Step 4 — Run ASP.NET Backend

Press F5 or click the green Run ▶️ button in Visual Studio.

You’ll see your API running in the browser at:

https://localhost:7071/swagger


or

http://localhost:5076/swagger


✅ This means your Web API backend is ready.

🟩 Step 5 — Run Angular Frontend

Now open a new Command Prompt or VS Code Terminal.

Go to your Angular folder (example):

cd EmployeeManagement.UI


Install dependencies:

npm install


Run Angular app:

ng serve --open


✅ The browser will open automatically at:

http://localhost:4200
