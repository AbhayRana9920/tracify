# 📦 Tracify: Lost & Found Management System

Welcome to **Tracify**, an advanced Java-based desktop application designed to simplify and digitalize the management of lost and found items in organizations, colleges, or public areas.
Built using **Java Swing** with a sleek dark-themed UI and **MySQL** for reliable data persistence, Tracify enables users and admins to efficiently register, track, and manage lost or found items — all through a modern, user-friendly interface.

This project emphasizes **Object-Oriented Programming (OOP)** principles for clean architecture, modularity, and maintainability.

---

## 🌟 Features

* 🔐 **User Registration & Secure Login** — Role-based access control for Users and Admins.
* 🧾 **Report Lost or Found Items** — Submit detailed reports with item descriptions and categories.
* 🧑‍💼 **Admin Dashboard** — Manage users, monitor reports, and view system-wide analytics.
* 📊 **Interactive Dashboard & Reports** — View trends and statistics of lost and found data.
* 💾 **Persistent Data with MySQL** — Ensures reliable storage and retrieval of user and item data.
* 🎨 **Dark, Modern Swing UI** — Designed with FlatLaf for a clean and professional interface.
* 🧩 **OOP & Design Patterns** — Follows MVC, DAO, and Service Layer patterns for modular structure.

---

## 🛠 Technologies Used

* **Java**: Swing for UI, JDBC for database connectivity.
* **MySQL**: Robust relational database for data persistence.
* **IntelliJ IDEA**: Maven-based project for streamlined development.
* **OOP Design Patterns**: MVC (Model-View-Controller), DAO (Data Access Object), and Service Layer patterns for clean architecture.

---

## 🏛️ OOP Principles Applied

The system showcases **Object-Oriented Programming (OOP)** principles, ensuring a maintainable and scalable codebase:

* **Encapsulation**: Data and methods are bundled into classes (e.g., User, Item), with private fields and public getters/setters to protect data integrity.
* **Inheritance**: Shared behavior is abstracted into base classes or interfaces (e.g., Item as a base for LostItem and FoundItem), promoting code reuse.
* **Polymorphism**: Dynamic method dispatch allows flexible handling of objects (e.g., ReportService processes both LostItem and FoundItem polymorphically).
* **Abstraction**: Interfaces and abstract classes (e.g., in dao and service packages) define contracts, hiding implementation details.
* **Modularity**: The MVC pattern separates concerns, with model for data, ui for views, and service/dao for logic, enhancing maintainability.

---

## 📁 Project Structure

```
Tracify/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── tracify/
│       │           ├── app/          # Application entry point
│       │           │   └── TracifyApp.java
│       │           ├── config/       # Configuration classes
│       │           ├── dao/          # Data Access Objects
│       │           ├── model/        # Entity models
│       │           ├── service/      # Business logic
│       │           └── ui/           # Swing UI components
│       └── resources/
│           ├── logging.properties
│           └── application.properties
│
├── lostfounddb.sql     # MySQL database schema and data
└── pom.xml             # Maven configuration
```

---


### 🛠 Prerequisites

* **JDK 17 or higher** — Installed and added to PATH
* **IntelliJ IDEA** — Latest version recommended
* **MySQL Server 8.0+** — Database setup required

---

### ⚙️ Setup Steps

#### 1️⃣ Clone or Download the Project

```bash
git clone https://github.com/AbhayRana9920/tracify.git
cd tracify
```

#### 2️⃣ Configure MySQL Database

Run the SQL script `lostfounddb.sql`:

```sql
SOURCE C:\path\to\lostfounddb.sql;
```

Check the tables:

```sql
SHOW TABLES;
```

Expected tables: `user`, `item`, `lost_item`, `found_item`, `report`

#### 3️⃣ Update Database Credentials

In `DBConfig.java`:

```java
private static final String URL = "jdbc:mysql://localhost:3306/lostfounddb";
private static final String USER = "root";
private static final String PASSWORD = "your_password";
```


### 🔑 Default Login Credentials

| Role      | Email                                       | Password |
| --------- |---------------------------------------------|----------|
| **Admin** | [javvy@gmail.com](mailto:admin@tracify.com) | javvy123 |

---

## 🧩 Troubleshooting

| Issue                        | Solution                                                |
| ---------------------------- | ------------------------------------------------------- |
| ❌ Database connection failed | Verify MySQL service and credentials in `DBConfig.java` |
| ⚠️ Missing dependencies      | Run `mvn clean install` or reload Maven project         |
| 🧱 Build error               | Ensure JDK 17+ is configured in IntelliJ                |
| 🗂 Tables missing            | Re-run `lostfounddb.sql` in MySQL                       |

---
