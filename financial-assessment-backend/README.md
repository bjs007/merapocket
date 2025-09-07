# Financial Assessment Backend

A standalone Express.js backend service for the Financial Health Assessment application powered by OpenAI GPT-4o-mini.

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. **Configure OpenAI API Key:**
   - Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/account/api-keys)
   - Update `.env` file with your API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

4. Update other configuration in `.env` as needed

5. Start development server:
```bash
pnpm dev
```

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm typecheck` - Run TypeScript type checking

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key for GPT-4o-mini model |
| `PORT` | No | Server port (default: 5000) |
| `FRONTEND_URL` | No | Frontend URL for CORS (default: http://localhost:3000) |
| `NODE_ENV` | No | Environment mode (development/production) |

## API Endpoints

### POST /api/financial-assessment

Calculates financial health score using AI analysis based on provided financial data.

**Features:**
- Uses OpenAI GPT-4o-mini for intelligent financial analysis
- Excludes personal name from AI processing for privacy
- Provides personalized advice based on comprehensive financial factors
- Returns score on 1-10 scale with detailed recommendations

**Request Body:**
```json
{
  "basicData": {
    "name": "string (optional, excluded from AI analysis)",
    "gender": "string (optional)",
    "profession": "string (required)",
    "salaryPerMonth": "number",
    "foodExpenses": "number",
    "houseRent": "number",
    "utilitiesExpenses": "number",
    "lifeInsurance": "boolean",
    "healthInsurance": "boolean",
    "bike": "boolean",
    "car": "boolean",
    "dependents": "number",
    "education": "string (required)",
    "housesOwned": "number",
    "country": "string (required)"
  },
  "advancedData": {
    "liquidCashFD": "number",
    "landNetWorth": "number",
    "stocksNetWorth": "number",
    "mutualFundNetWorth": "number",
    "goldNetWorth": "number",
    "otherInvestment": "number",
    "city": "string",
    "state": "string"
  }
}
```

**Response:**
```json
{
  "overallScore": "number (1.0-10.0)",
  "advice": "string (AI-generated personalized advice)",
  "calculationId": "string",
  "timestamp": "string"
}
```

**Error Responses:**
- `400` - Validation error (missing required fields)
- `500` - Server error (OpenAI API issues, configuration errors)

## AI-Powered Analysis

The backend uses OpenAI's GPT-4o-mini model to analyze financial data and provide:

- **Intelligent Scoring**: Contextual analysis considering income, expenses, investments, location, and life situation
- **Personalized Advice**: Tailored recommendations based on specific financial profile
- **Privacy Protection**: Personal name is excluded from AI analysis
- **Comprehensive Factors**: Includes expense ratios, investment diversification, insurance coverage, emergency funds, and location-specific considerations

### Health Check

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-23T10:30:00.000Z"
}
```

## Getting Started

1. **Get OpenAI API Key**: 
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Create an API key from your dashboard
   - Ensure you have sufficient credits/usage limits

2. **Set Environment Variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

3. **Install Dependencies**:
   ```bash
   pnpm install
   ```

4. **Start Development Server**:
   ```bash
   pnpm dev
   ```

## Project Structure

```
src/
├── routes/           # API route handlers
│   └── financial-assessment.ts
├── types/            # TypeScript type definitions
│   └── api.ts
└── server.ts         # Main server entry point
```

## Deployment Notes

When deploying to production:

1. Set `OPENAI_API_KEY` environment variable in your deployment platform
2. Monitor OpenAI API usage and costs
3. Consider implementing rate limiting for API calls
4. Set appropriate CORS origins in `FRONTEND_URL`

## Error Handling

The API includes comprehensive error handling for:

- Missing or invalid input data
- OpenAI API configuration issues
- Rate limiting and quota exceeded errors
- Invalid JSON responses from AI
- Network connectivity issues

Example error response:
```json
{
  "error": "CONFIGURATION_ERROR",
  "message": "OpenAI API key is not configured",
  "details": {}
}
```
