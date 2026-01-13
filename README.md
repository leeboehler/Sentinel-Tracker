<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Fs1GGAsNJKXl8-77MfYQEDkgguEKQEm7

## Run Locally

**Prerequisites:**  Node.js

### Installing Node.js

If you don't have Node.js installed, you can install it using one of these methods:

**Option 1: Using Homebrew (Recommended for macOS)**
```bash
brew install node
```

**Option 2: Download from nodejs.org**
Visit [https://nodejs.org/](https://nodejs.org/) and download the LTS version for macOS.

**Option 3: Using nvm (Node Version Manager)**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal or run:
source ~/.zshrc

# Install Node.js
nvm install --lts
nvm use --lts
```

After installing Node.js, verify the installation:
```bash
node --version
npm --version
```

### Setup Steps

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   ```bash
   npm run dev
   ```

## Deploy to Vercel

This project is configured and ready to deploy to Vercel. Follow these steps:

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to [Vercel](https://vercel.com)** and sign in with your GitHub account

3. **Click "Add New Project"** and import your repository

4. **Configure Environment Variables**:
   - In the project settings, go to "Environment Variables"
   - Add `GEMINI_API_KEY` with your Gemini API key value
   - Make sure it's available for Production, Preview, and Development environments

5. **Deploy**: Vercel will automatically detect this as a Vite project and deploy it

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables**:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Enter your Gemini API key when prompted.

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Project Configuration

The project includes a `vercel.json` configuration file that:
- Sets the build command to `npm run build`
- Configures the output directory to `dist`
- Sets up proper routing for the SPA (Single Page Application)
- Auto-detects Vite as the framework

### Environment Variables

Make sure to set the following environment variable in Vercel:
- `GEMINI_API_KEY`: Your Gemini API key

**Note**: The Supabase credentials are already configured in the code and don't need to be set as environment variables.
