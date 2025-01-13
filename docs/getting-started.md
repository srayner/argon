# Getting Started

Welcome to the `Agon` project! This guide will walk you through setting up the project on your local machine.

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js**: Make sure you have Node.js installed (version 14.x or higher is recommended).
- **npm**: npm should come with Node.js, but ensure it’s installed.
- **MySQL Server**: Access to a MySQL server where you can create a new database.
- **Git**: Ensure Git is installed on your machine.

## Setup Instructions

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/srayner/agon.git
```

### 2. Navigate to the Project Directory

Change into the project directory:

```bash
cd agon
```

### 3. Install Dependencies

Install the necessary dependencies by running:

```bash
npm install
```

### 4. Set Up the Database

Create a Database: Log into your MySQL server and create a new database.

Example MySQL command:

```sql
CREATE DATABASE agon_db;
Configure Environment Variables: Create a .env file in the root of your project directory and add your database connection details. Here's a sample .env file:
```

env

DATABASE_URL="mysql://username:password@localhost:3306/agon_db"
Replace username, password, and agon_db with your MySQL credentials and database name.

### 5. Prisma Setup (if needed)

The project likely uses Prisma for database management. You'll need to ensure Prisma is set up correctly:

Generate Prisma Client: Run the following command to generate the Prisma client:

```bash
npx prisma generate
Migrate Database: Apply any existing migrations to your new database:
```

```bash
npx prisma migrate dev
This will apply the current schema to your database and ensure it's up to date.
```

### 6. Start the Development Server

Start the development server with:

```bash
Copy code
npm run dev
```

### 7. Access the Application

Open your web browser and navigate to:

http://localhost:3000
You should see the application running locally.

Additional Notes
If you encounter any issues during setup, check the logs for errors and ensure all services (like MySQL) are running.
For further customization or environment-specific settings, update the .env file accordingly.
Enjoy working on Agon!
