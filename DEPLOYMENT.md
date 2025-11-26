# MERN Stack Application Deployment Guide for cPanel

## Prerequisites
1. A cPanel hosting account
2. Node.js support enabled on your hosting
3. MongoDB Atlas account (for database hosting)
4. Domain name pointed to your hosting

## Step 1: Prepare Your Application

### Backend Preparation
1. For local development, use this `.env` configuration:

   PORT=5000
   DEV_MONGO_URI=mongodb://localhost:27017/test
   JWT_SECRET=1c0693783de418917d9e6ce7030678e7d7dd8386e16c2b671effb1e90cf81ec1
  

2. For production deployment, create a different `.env` file:
   
   NODE_ENV=production
   MONGO_URI=mongodb+srv://soumyamajumder201817_db_user:Barojonepur%402025@testmernappapi.hcnpddn.mongodb.net/?retryWrites=true&w=majority&appName=testmernappApi
   JWT_SECRET=1c0693783de418917d9e6ce7030678e7d7dd8386e16c2b671effb1e90cf81ec1

   Note: In production:
   - Do not set PORT as it will be managed by cPanel
   - Use your actual MongoDB Atlas connection string
   - Use a secure random string for JWT_SECRET

3. Make sure all dependencies are listed in `package.json`
4. Test your application locally using `npm run dev` or `npm start`

### Frontend Preparation
1. Create two environment files in your client directory:

   For local development (.env.development):

   REACT_APP_API_URL=http://localhost:5000/api


   For production (.env.production):

   REACT_APP_API_URL=https://mern.soumyadeveloper.site/api


2. Update axios calls in your components to use the environment variable:
 
   axios.post(`${process.env.REACT_APP_API_URL}/users/login`, formData)

3. Build the React application:

   cd client
   npm run build

## Step 2: Create MongoDB Atlas Database
1. Create a new cluster in MongoDB Atlas
2. Create a database user with read/write permissions
3. Add your connection string to your server's `.env` file
4. Whitelist all IP addresses (0.0.0.0/0) for initial testing

## Step 3: Upload Files to cPanel

### Application Upload
1. Log in to cPanel
2. Navigate to File Manager
3. Go to `/public_html/mern.soumyadeveloper.site/`
4. Create two directories:
   - `client` (for frontend)
   - `server` (for backend)
5. Upload files:
   - Upload the built React app (contents of your local `client/build`) to the `client` directory
   - Upload all server files to the `server` directory
6. Create a new `.env` file in the server directory with production values (use the production values shown in Backend Preparation section)
7. Set correct permissions:
   ```bash
   chmod 755 /public_html/mern.soumyadeveloper.site/client
   chmod 755 /public_html/mern.soumyadeveloper.site/server
   chmod 644 /public_html/mern.soumyadeveloper.site/server/.env
   ```
8. Create an `.htaccess` file in `/public_html/mern.soumyadeveloper.site/client` directory

## Step 4: Configure Node.js App in cPanel
1. In cPanel, find "Setup Node.js App"
2. Create a new Node.js application:
   - Application mode: Production
   - Node.js version: 16.x or later
   - Application root: /public_html/mern.soumyadeveloper.site/server
   - Application URL: https://mern.soumyadeveloper.site/api
   - Application startup file: server.js
      Environment variables:
     
     NODE_ENV=production
     MONGO_URI=mongodb+srv://soumyamajumder201817_db_user:Barojonepur%402025@testmernappapi.hcnpddn.mongodb.net/?retryWrites=true&w=majority&appName=testmernappApi
     JWT_SECRET=1c0693783de418917d9e6ce7030678e7d7dd8386e16c2b671effb1e90cf81ec1
     
     Important notes: 
     - Do not set PORT in cPanel environment variables
     - Use the same MongoDB URI and JWT_SECRET as in your server's `.env` file
     - Make sure NODE_ENV is set to 'production'
3. Important Path Notes:
   - The application root MUST point to the server directory in your subdomain
   - Make sure the path exactly matches: /public_html/mern.soumyadeveloper.site/server
   - The URL should be your subdomain with /api endpoint
4. After creating the application:
   - Click on "Run NPM Install" to install dependencies
   - Ensure all environment variables are set correctly
   - Start the application using the "Run JS script" option

## Step 5: Configure Frontend and Apache
1. Create or edit the `.htaccess` file in `/public_html/mern.soumyadeveloper.site/client`:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /index.html [L]

# Redirect API requests to Node.js application
RewriteRule ^api/(.*) https://mern.soumyadeveloper.site/api/$1 [P,L]
```

2. Update your subdomain's document root:
   - In cPanel, go to "Domains" or "Subdomains"
   - Find mern.soumyadeveloper.site
   - Set the document root to: /public_html/mern.soumyadeveloper.site/client
Create or edit the .htaccess file in public_html:
\`\`\`apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l
RewriteRule . /index.html [L]
\`\`\`

## Step 6: Start the Application
1. In cPanel Node.js App Manager, start your application
2. Check the logs for any errors
3. Test your application by visiting your domain

## Common Issues and Solutions

### CORS Issues
If you experience CORS issues:
1. Ensure your backend CORS configuration matches your domain
2. Add your domain to the allowed origins in your server configuration

### 404 Errors
If you get 404 errors on page refresh:
1. Verify the .htaccess file is properly configured
2. Check that mod_rewrite is enabled on your server

### Database Connection Issues
If MongoDB connection fails:
1. Verify your IP whitelist in MongoDB Atlas
2. Check your connection string in the environment variables
3. Ensure MongoDB user has correct permissions

### Node.js Application Not Starting
If the Node.js application fails to start:
1. Check the application logs in cPanel
2. Verify all dependencies are listed in package.json
3. Ensure the node version matches your application requirements

## Security Considerations
1. Use HTTPS for your domain
2. Keep your JWT_SECRET secure and unique
3. Implement rate limiting on your API routes
4. Set up proper MongoDB Atlas security settings
5. Regular backup of your database
6. Monitor server logs for suspicious activities

## Monitoring and Maintenance
1. Set up regular backups of your database
2. Monitor server logs for errors
3. Keep dependencies updated
4. Implement proper error logging
5. Set up monitoring for server uptime

## Additional Tips
1. Use PM2 or similar process manager if available
2. Implement proper error handling and logging
3. Set up automatic database backups
4. Configure proper caching strategies
5. Implement CDN for static assets if needed

Remember to always test your application thoroughly in a staging environment before deploying to production.