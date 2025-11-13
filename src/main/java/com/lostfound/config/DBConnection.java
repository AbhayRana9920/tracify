package com.lostfound.config;

// Provides database connection for the Lost and Found System.
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    // Database URL for MySQL connection (replace with your MySQL connection link).
    private static final String URL = "jdbc:mysql://localhost:3306/lostfounddb";
    // Database username (replace with your MySQL username).
    private static final String USER = "root";
    // Database password (replace with your MySQL password).
    private static final String PASSWORD = "abroot@mysql#123";

    // Establishes and returns a connection to the MySQL database.
    // This method will first check for environment variables DB_URL, DB_USER and DB_PASS
    // and fall back to the constants above if they are not set. This avoids the need
    // to edit source when running locally — simply set environment variables in your shell.
    public static Connection getConnection() {
        String url = System.getenv("DB_URL");
        String user = System.getenv("DB_USER");
        String pass = System.getenv("DB_PASS");

        if (url == null || url.isBlank()) {
            url = URL;
        }
        if (user == null || user.isBlank()) {
            user = USER;
        }
        if (pass == null) {
            pass = PASSWORD;
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(url, user, pass);
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            return null;
        }
    }
}