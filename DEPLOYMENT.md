# CI/CD Deployment Setup for cPanel

This project uses GitHub Actions to automatically build and deploy to cPanel hosting via FTP.

## Setup Instructions

### 1. Add GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `FTP_SERVER` | Your cPanel FTP server hostname | `ftp.yourdomain.com` or `yourdomain.com` |
| `FTP_USERNAME` | Your cPanel FTP username | `username@yourdomain.com` |
| `FTP_PASSWORD` | Your cPanel FTP password | `your-ftp-password` |
| `FTP_SERVER_DIR` | Remote directory path on server | `/public_html/` or `/public_html/subdirectory/` |

### 2. Finding Your cPanel FTP Credentials

1. Log in to your cPanel account
2. Navigate to **FTP Accounts** section
3. Use existing FTP account credentials or create a new one
4. For `FTP_SERVER`, use your domain or check **Configure FTP Client** for the hostname

### 3. Server Directory Path

- **Root domain**: Use `/public_html/`
- **Subdomain**: Use `/public_html/subdomain/` or the path shown in cPanel
- **Addon domain**: Check the document root in cPanel → Domains

### 4. Trigger Deployment

The workflow triggers automatically when you:
- Push to `main` or `master` branch
- Manually trigger via **Actions** tab → **Deploy to cPanel** → **Run workflow**

## Workflow Features

- ✅ Automatic build on push to main/master
- ✅ Node.js 20 with npm caching for faster builds
- ✅ FTP deployment with incremental updates
- ✅ Manual trigger option

## Troubleshooting

### Build Fails
- Check if `npm run build` works locally
- Verify all dependencies are in `package.json`

### FTP Connection Fails
- Verify FTP credentials in cPanel
- Check if FTP server allows connections (some hosts block certain IPs)
- Try using passive FTP mode if needed

### Files Not Showing
- Verify `FTP_SERVER_DIR` path is correct (must end with `/`)
- Check file permissions on the server

## Adding .htaccess for SPA Routing

Create a `.htaccess` file in your `public/` folder for client-side routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```
