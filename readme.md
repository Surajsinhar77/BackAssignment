# StockPost - MERN Stack Application

## Overview

StockPost is a MERN (MongoDB, Express.js, React, Node.js) stack-based application that allows users to create, comment, like, and manage stock-related posts. The app also includes real-time updates for comments and likes using **Socket.io** and implements **JWT-based user authentication** for secure access.

This repository contains the **backend** code that powers StockPost, handling user authentication, post management, commenting, and real-time updates.

---

## Features

1. **User Authentication**: Register, login, and update profile (username, bio, profile picture) using JWT tokens.
2. **Stock Post Management**: Users can create posts related to specific stocks with stock symbols, titles, descriptions, and tags.
3. **Commenting System**: Users can comment on posts. Comments are linked to both the user and the post.
4. **Like System**: Users can like or unlike posts. The total number of likes is displayed on each post.
5. **Filtering and Sorting**: Posts can be filtered by stock symbol or tags, and sorted by date or number of likes.
6. **Pagination**: Supports pagination when fetching posts.
7. **Real-time Updates**: Real-time updates for comments and likes using **Socket.io**.
8. **API Documentation**: Optional API documentation using **Postman**.

---

## Tech Stack

- **MongoDB**: For data storage.
- **Express.js**: Backend server and API routes.
- **Node.js**: Server-side JavaScript runtime.
- **JWT (JSON Web Token)**: For authentication and authorization.
- **Socket.io**: Real-time updates for comments and likes.
- **Mongoose**: MongoDB ODM for schema modeling and data handling.
- **Jest**: Testing framework for unit and integration tests.
- **Bcrypt**: Password hashing for secure user authentication.
- **Multer**: Middleware for handling file uploads.
- **Cloudinary**: Cloud-based image for profile pictures.
- **Zod**: JavaScript schema validation library.

---

## Table of Contents

- [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [Authentication](#user-authentication)
  - [Posts](#stock-posts-management)
  - [Comments](#comments-management)
  - [Likes](#like-system)
  - [Real-time Updates](#real-time-updates)
- [Database Schema](#database-schema)
- [Running Tests](#running-tests)
- [Socket.io Real-time Updates](#socketio-real-time-updates)
<!-- - [Contributing](#contributing)
- [License](#license) -->

---

## Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (Running locally or using a cloud service like MongoDB Atlas)

### Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Surajsinhar77/BackAssignment.git
   ```

2. **Navigate into the project directory**:

   ```bash
   cd StockPost
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Create a `.env` file** in the root directory with the following environment variables:

   ```bash
    DATABASE_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>
    PORT=5000
    ACCESS_TOKEN_SECRET_KEY=your-access-token-secret
    REFRESH_TOKEN_SECRET_KEY=your-refresh-token-secret
    CLOUD_NAME=your-cloudinary-cloud-name
    CLOUD_API_KEY=your-cloudinary-api-key
    API_SECRET=your-cloudinary-api-secret
    CLOUDINARY_URL=cloudinary://your-cloudinary-url
    SESSION_SECRET=your-session-secret
    NODE_ENV=development
   ```

5. **Start the development server**:

   ```bash
   npm run dev
   ```

   The backend will start running on `http://localhost:5000`.
   The socket server will start running on `http://localhost:5000`.

---

## API Endpoints

### User Authentication

1. **Register** - `POST /api/auth/register`

   Request:

   ```json
    {
        "username": "suraj",
        "email": "suraj123@gmail.com",
        "password": "password123"
    }
   ```

   Response:

   ```json
    {
        "success": true,
        "message": "User registered successfully",
        "data": {
            "userId": "66e1500765a87221b49f757c"
        }
    }
   ```

2. **Login** - `POST /api/auth/login`

   Request:

   ```json
    {
        "email": "suraj123@gmail.com",
        "password": "password123"
    }
   ```

   Response:

   ```json
    {
        "data": {
            "token": "your-access-token",
            "user": {
                "_id": "66e1500765a87221b49f757c",
                "username": "suraj",
                "email": "suraj123@gmail.com"
            }
        }
    }
   ```

3. **Get User Profile** - `GET /api/user/profile/:userId`

    Headers: `{ Authorization: Bearer <token> }`
    Response:
    
    ```json
    {
        "data": {
            "_id": "66dfd7b8e6558cd09067e7ed",
            "username": "suraj",
            "bio": "I am Full Stack developer and Mern Stack",
            "profilePicture": "https://res.cloudinary.com/do4cvkenc/image/upload/v1725947975/uploads/profile-images/wkfwjseoedvxyjutegfc.jpg",
            "createdAt": "2024-09-10T05:23:04.882Z"
        }
    }
    ```

4. **Update User Profile** - `PUT /api/user/profile`

    Response:

    ```json
    {
        "success": true,
        "message": "Profile updated successfully"
    }
    ```
---

### Stock Posts Management

1. **Create a Stock Post** - `POST /api/posts`

   Headers: `{ Authorization: Bearer <token> }`

   Request:

   ```json
    {
        "stockSymbol": "AAPL",
        "title": "Apple Stock Discussion",
        "description": "Discussing about Apple stock performance",
        "tags": ["tech", "investment"]
    }
   ```

2. **Get All Stock Posts** - `GET /api/posts`

   Optional query parameters: `stockSymbol`, `tags`, `sortBy`
   Request : `GET /api/posts?stockSymbol=AAPL&tags=tech&sortBy=likes`

   Response:

   ```json
   {
        "data": {
            "posts": [
                {
                    "_id": "66dff5ff0ca42f8d2c950c23",
                    "stockSymbol": "AAGL",
                    "title": "This is title post",
                    "description": "The descriptionof the post in long",
                    "likesCount": 0,
                    "createdAt": "2024-09-10T07:32:15.029Z"
                },
                {
                    "_id": "66dff5ff0ca42f8d2c950c25",
                    "stockSymbol": "AAGL",
                    "title": "This is title post",
                    "description": "The descriptionof the post in long",
                    "likesCount": 1,
                    "createdAt": "2024-09-10T07:32:15.991Z"
                }
            ],
            "page": 1,
            "limit": 10
        }
    }
   ```

3. **Get a Single Stock Post** - `GET /api/posts/:postId`

4. **Delete a Stock Post** - `DELETE /api/posts/:postId`

---

### Comments Management

1. **Add a Comment** - `POST /api/posts/:postId/comments`

   Request:

   ```json
   {
     "comment": "This is a comment."
   }
   ```

2. **Delete a Comment** - `DELETE /api/posts/:postId/comments/:commentId`

---

### Like System

1. **Like a Post** - `POST /api/posts/:postId/like`

2. **Unlike a Post** - `DELETE /api/posts/:postId/like`

---

### Real-time Updates

- **Socket.io Events**: Users receive real-time updates when a new comment or like is added to a post they are viewing.
- **Socket request URL** - "http://localhost:5000/commentsAndLikes"
    ![alt text](image.png)
    Add all the Events in the socket.io client side code to get the real time updates.
    - `likePost`: Broadcasted when a post is liked.
    - `commentPost`: Broadcasted when a new comment is added to a post.
    - `delComment`: Broadcasted when a comment is deleted from a post.
    - `postUnlike`: Broadcasted when a post is unLiked.
    - `newComment`: Broadcasted when a new comment is added to a post.
---

## Database Schema

### User Model

- `username`: String
- `email`: String
- `password`: String (hashed)
- `bio`: String (optional)
- `profilePicture`: String (optional)

### Post Model

- `stockSymbol`: String
- `title`: String
- `description`: String
- `tags`: [String] (optional)
- `createdAt`: Date
- `user`: ObjectId (linked to User model)

### Comment Model

- `post`: ObjectId (linked to Post)
- `user`: ObjectId (linked to User)
- `comment`: String
- `createdAt`: Date

### Like Model

- `post`: ObjectId (linked to Post)
- `user`: ObjectId (linked to User)

---

## Running Tests

Testing can be done using **Jest**.

1. **Install Jest**:

   ```bash
   npm install --save-dev jest
   ```

2. **Run Tests**:

   ```bash
   npm run test
   ```

---

## Socket.io Real-time Updates

Real-time updates for likes and comments are powered by **Socket.io**. When a user adds a comment or likes a post, all connected users viewing that post will get the update in real time.

### Socket Events

- `newComment`: Broadcasted when a new comment is added to a post.
- `newLike`: Broadcasted when a post is liked.

---

<!-- ## Contributing

Contributions are welcome! Please follow the guidelines below:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Create a pull request.

--- -->

By following this guide, you will have a fully functional backend setup for the StockPost application.