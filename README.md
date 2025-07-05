# Bias Buster - News Bias Analysis Web App

A comprehensive web application that analyzes news articles for bias, factuality, and provides comparative coverage from multiple sources with simulated social media sentiment analysis.

Demo Link:https://leafy-chimera-e2570b.netlify.app/

# Screenshots

![Screenshot 2025-07-05 123704](https://github.com/user-attachments/assets/4e9de2ff-1b99-4e49-9b27-05f277287336)
![Screenshot 2025-07-05 123636](https://github.com/user-attachments/assets/27834fe8-481c-4f23-a533-b707f8022f16)
![Screenshot 2025-07-05 123729](https://github.com/user-attachments/assets/75083a4c-6cc7-425d-8cd6-e7261c40a436)
![Screenshot 2025-07-05 123819](https://github.com/user-attachments/assets/45577e2f-927e-44bb-941a-8aad496658a5)
![Screenshot 2025-07-05 141647](https://github.com/user-attachments/assets/a2c86298-9b99-45c5-8384-0e43f18c4314)






## Features

- **Real-time Bias Detection**: Analyzes political bias, emotional language, and factuality
- **Comparative Coverage**: Shows how different news sources cover the same story
- **Social Media Simulation**: Generates realistic social media reactions and discussions
- **Source Credibility**: Comprehensive database of news source bias ratings
- **Personal Analytics**: Track your reading habits and bias exposure
- **Modern UI**: Aurora backgrounds, click effects, and glassmorphism design
- 

## API Integration

This application integrates with news APIs and uses local analysis for bias detection:

### News APIs
- **NewsAPI.org**: Primary news aggregation
- **GNews**: Alternative news source and search
- **Article Extraction**: Real-time content parsing

### Analysis Features
- **Custom NLP**: Local bias keyword detection and content analysis
- **Sentiment Analysis**: Keyword-based sentiment detection
- **Social Media Simulation**: Realistic mock social media reactions

## Setup Instructions

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Get API Keys**
   - NewsAPI: Register at [newsapi.org](https://newsapi.org)
   - GNews: Get key from [gnews.io](https://gnews.io)

3. **Configure API Keys**
   - Go to the "API Settings" tab in the application
   - Enter your API keys (stored locally in browser)
   - Keys are required for full functionality

4. **Run the Application**
   ```bash
   npm run dev
   ```

## API Rate Limits

- **NewsAPI**: 100 requests/day (free tier)
- **GNews**: 100 requests/day (free tier)

## Usage

1. **Analyze Articles**: Paste any news article URL to get instant bias analysis
2. **Compare Coverage**: See how different sources frame the same story
3. **Check Social Sentiment**: View simulated social media reactions
4. **Track Reading Habits**: Monitor your news consumption patterns
5. **Explore Sources**: Browse comprehensive news source directory

## Technical Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios for API requests
- **Content Extraction**: Custom article parsing with fallbacks
- **Bias Detection**: Multi-layered analysis combining source ratings and content analysis
- **Social Simulation**: Realistic mock social media reactions based on article content

## Privacy & Security

- API keys stored locally in browser (localStorage)
- No server-side data storage
- CORS-compliant API requests
- Client-side content processing

