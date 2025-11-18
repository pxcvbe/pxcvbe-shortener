# URL Shortener API (Backend Services)

A robust, production-ready URL shortening service built with **Node.js**, **Express**, and **Prisma**. `Transform long URLs into short`, `shareable links with click tracking and analytics`.

## ✨ Features
- **URL Shortening**: Convert long `URLs` into compact, and `short codes`.
- **Click Analytics**: `Track the number of clicks` for each shortened URL.
- **Statistics**:  Get detailed `statistics` for any shortened URL.
- **RESTful API**: Clean, intuitive `REST API` endpoints.
- **Database Persistence**: `SQLite` database with `Prisma ORM`.
- **Modern UI**: Beautiful landing page with responsive design.
- **Unique Short Codes**: Collision-resistant short code generation using `nanoid`.

---

## 💻 Tech Stack 

- **Runtime**: [Node.js](https://nodejs.org/en) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/) 5.x
- **Database**: [SQLite](https://sqlite.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Short Code Generator**: [nanoid](https://www.npmjs.com/package/nanoid)
- **Validation**: Built-in Express middleware.

<p align="center">
    <img src="https://skillicons.dev/icons?i=nodejs,express,sqlite,prisma,nanoid" />
</p>

---

## 📜 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Version 18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)

## Installation

1. **Clone the repository**

    ```bash
    git clone <repo-url>
    cd pxcvbe-shortener
    ```

2. **Install depedencies**

    ```bash
    npm install
    ```

3. **Setup environment variables**

    Create a `.env` file in the root directory:
    ```env
    PORT=5000
    BASE_URL=http://localhost:5000
    DATABASE_URL="file:./prisma/dev.db"
    ```

4. **Initialize the database**

    ```bash
    npx prisma generate
    npx prisma migrate deploy
    ```

5. **Start the server**
    ```bash
    npm start
    ```

    The server will start at `http://localhost:5000` (or use your own configured PORT)

---

## ⚙️ Configuration 

The application uses environment variables for configuration. Create a `.env` file with the following:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `BASE_URL` | Base URL for shortened links | `http://localhost:5000` |
| `DATABASE_URL` | Prisma database connection string | `file:./prisma/dev.db` |

---

## 🎯 API Endpoints

### Base URL
```
http://{BASE_URL}/api/v1/url
```

### 1. Create Short URL

**Endpoint**: `POST /api/v1/url/shorten`

**Request Body**:
```json
{
    "originalUrl": "https://example.com/very/long-long-long/url/path"
}
```

**Response** <span style="color:green;">(201 Created)</span>:


```json
{
  "shortCode": "QjynLh",
  "shortUrl": "http://localhost:5000/QjynLh"
}
```

**Error Response**:
- **`400 Bad Request`**: Missing `originalUrl` field.
- **`500 Internal Server Error`**: Server error.

### 2. List All URLs

**Endpoint**: `GET /api/v1/url/list`

**Response** <span style="color:green;">(200 OK)</span>:
```json
[
  {
    "id": "01HXYZ123ABC",
    "originalUrl": "https://example.com/very/long-long-long/url/path",
    "shortCode": "QjynLh",
    "clicks": 69,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  ...
]
```

### 3. Get URL Statistics

**Endpoint**: `GET /api/v1/url/:shortCode/stats`

**Response** (200 OK):
```json
{
  "shortCode": "QjynLh",
  "originalUrl": "https://example.com/very/long-long-long/url/path",
  "clicks": 42,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. Redirect to Original URL

**Endpoint**: `GET /:shortCode`

**Description**: Redirects to the original URL and increments the click counter.

**Response**: 
- `302 Redirect`: Redirects to the original URL
- `404 Not Found`: Short code doesn't exist

---

## 🗂️ Project Structure

```
server/
├── src/
│   ├── app.js                      # Express application setup
│   ├── config/
│   │   ├── db.js                   # Prisma client configuration
│   │   └── env.js                  # Environment variables configuration
│   ├── controllers/
│   │   └── url.controller.js       # URL route controllers
│   ├── routes/
│   │   └── url.routes.js           # URL API routes
│   ├── services/
│   │   └── url.service.js          # Business logic for URL operations
│   └── utils/
│       └── generateShortCode.js    # Short code generation utility
├── prisma/
│   ├── schema.prisma               # Prisma schema definition
│   ├── dev.db                      # SQLite database file
│   └── migrations/                 # Database migrations
├── public/
│   ├── index.html                  # Landing page
│   └── styles.css                  # Landing page styles
├── package.json                    # Project dependencies and scripts
└── README.md                       # This file
```

---

## ⛁ Database Schema

The application uses the following database schema:

```prisma
model Url {
  id          String   @id @default(ulid())
  originalUrl String
  shortCode   String   @unique
  clicks      Int      @default(0)
  createdAt   DateTime @default(now())
}
```

### Fields:
- **id**: Unique identifier (ULID)
- **originalUrl**: The original long URL
- **shortCode**: Unique 6-character short code
- **clicks**: Number of times the URL has been accessed
- **createdAt**: Timestamp when the URL was created

## </> Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the development server |
| `npm run build` | Generate Prisma Client |

---

## 📝 Example Usage

### Using cURL

**Create a short URL**:
```bash
curl -X POST http://localhost:5000/api/v1/url/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com/very/long-long-long/url/path"}'
```

**List all URLs**:
```bash
curl http://localhost:5000/api/v1/url/list
```

**Get URL statistics**:
```bash
curl http://localhost:5000/api/v1/url/QjynLh/stats
```

**Access shortened URL**:
```bash
curl -L http://localhost:5000/QjynLh
```

### Using JavaScript (fetch)

```javascript
// Create short URL
const response = await fetch('http://localhost:5000/api/v1/url/shorten', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ originalUrl: 'https://example.com/very/long-long-long/url/path' })
});

const data = await response.json();
console.log(data.shortUrl); // http://localhost:5000/QjynLh
```

---

## 🔧 Development

### Database Migrations

To create a new migration:

```bash
npx prisma migrate dev --name migration_name
```

To apply migrations:
```bash
npx prisma migrate deploy
```

### Prisma Studio

To view and edit database data:
```bash
npx prisma studio
```

---

### 「 ✦ Author ✦ 」

- [pxcvbe](https://github.com/pxcvbe) / **Ivan Kurniawan**.

- `Built` with [Express.js](https://expressjs.com/).
- Database `managed` with [Prisma](https://www.prisma.io/).
- Short code generation `powered` by [nanoid](https://github.com/ai/nanoid).
- `Documentation` code with [JSDoc](https://jsdoc.app/).
