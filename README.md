# 🚀 Employee Management System

A full-stack **Employee Management System** built using **ASP.NET Core Web API** and **Angular**.
This application helps manage employees, departments, attendance, and leave with secure authentication and a modern UI.

---

## 🛠️ Tech Stack

### 🔹 Frontend

* Angular
* Angular Material / Tailwind CSS
* TypeScript
* Bootstrap

### 🔹 Backend

* ASP.NET Core Web API
* Entity Framework Core
* SQL Server / PostgreSQL

### 🔹 Authentication

* JWT (JSON Web Token)
* Role-Based Access (Admin & Employee)

---

## ✨ Features

✅ User Authentication (Login/Register)
✅ Role-Based Authorization (Admin / Employee)
✅ Employee CRUD Operations
✅ Department Management
✅ Leave Management (Apply / Approve / Reject)
✅ Attendance Tracking
✅ Secure API with JWT
✅ Responsive UI Design

---

## 📂 Project Structure

```
EmployeeManagementSystem/
│
├── Backend/ (ASP.NET Core API)
│   ├── Controllers
│   ├── Services
│   ├── Repositories
│   ├── Models
│   └── Middleware
│
├── Frontend/ (Angular)
│   ├── Components
│   ├── Services
│   ├── Modules
│   └── Assets
```

---

## ⚙️ Installation & Setup

### 🔹 Backend (ASP.NET Core)

1. Navigate to backend folder:

```
cd Backend
```

2. Restore packages:

```
dotnet restore
```

3. Update database:

```
dotnet ef database update
```

4. Run project:

```
dotnet run
```

---

### 🔹 Frontend (Angular)

1. Navigate to frontend folder:

```
cd Frontend
```

2. Install dependencies:

```
npm install
```

3. Run Angular app:

```
ng serve
```

4. Open in browser:

```
http://localhost:4200
```

---

## 🔐 API Authentication

* Login API returns JWT token
* Token stored in localStorage
* Token sent in headers:

```
Authorization: Bearer <token>
```

---

## 📸 Screenshots

*Add screenshots of your UI here (Dashboard, Employee List, Login Page)*

---

## 🚀 Future Enhancements

* 📊 Dashboard Analytics
* 📧 Email Notifications
* 📁 File Upload (Employee Documents)
* 🌐 Deployment (Azure / AWS)

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📧 Contact

👤 Your Name
📧 [your-email@example.com](mailto:your-email@example.com)
🔗 LinkedIn: https://linkedin.com/in/your-profile

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
<img width="1919" height="971" alt="Screenshot 2026-03-31 201205" src="https://github.com/user-attachments/assets/2f75c1a3-bd37-4a06-a469-e8fdc81b3552" />
<img width="1919" height="980" alt="Screenshot 2026-03-31 201227" src="https://github.com/user-attachments/assets/1d06fdcd-d0b6-4f0a-809e-e97e1c72c0b4" />
<img width="1919" height="970" alt="Screenshot 2026-03-31 201234" src="https://github.com/user-attachments/assets/87cf131c-f69a-4525-9767-c5bda6462f1e" />
<img width="1919" height="972" alt="Screenshot 2026-03-31 201249" src="https://github.com/user-attachments/assets/89ed98bb-6c0c-47de-bc17-384eaccdd01d" />



