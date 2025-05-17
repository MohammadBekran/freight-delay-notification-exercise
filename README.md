# Freight Delay Notification Task

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Temporal.io](https://img.shields.io/badge/Temporal.io-1.11.8-orange.svg)](https://temporal.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust TypeScript application leveraging Temporal.io workflows to monitor freight delays and send automated notifications, powered by Google Maps, OpenAI, and Twilio.

## 🚀 Features

- 🗺️ Traffic monitoring (Google Maps API)
- 🤖 AI-powered delay notifications (OpenAI)
- 📱 SMS notifications (Twilio)
- ⚡ Fault-tolerant workflows (Temporal.io)
- 🔒 Type-safe environment validation
- 📊 Comprehensive metrics tracking

## 🛠️ Prerequisites

- Node.js v22+
- PNPM v10+
- Temporal server (local or remote)
- API keys:
  - Google Maps Platform
  - OpenAI
  - Twilio

## 📦 Installation

```bash
git clone https://github.com/MohammadBekran/freight-delay-notification-exercise.git
cd freight-delay-notification-exercise
pnpm install
```

## ⚙️ Configuration

Create `.env` in project root:

```env
# Application Configuration
DELAY_THRESHOLD= # Delay threshold in minutes

# Google Maps API Configuration
GOOGLE_MAPS_API_KEY= # Required for calling Google Maps Directions API
DESTINATION= # e.g. Milwaukee
ORIGIN= # e.g. Chicago

# OpenAI API Configuration
OPENAI_API_KEY= # Required for calling OpenAI API

# Twilio API Configuration
TWILIO_SID= # Required for calling Twilio API
TWILIO_AUTH_TOKEN= # Required for calling Twilio API
TWILIO_PHONE= # Your Twilio phone number with country code
CUSTOMER_PHONE= # Customer's phone number with country code
```

## 🏗️ Project Structure

```
src/
├── core/
│   ├── constants/     # App constants
│   ├── services/      # API integrations
│   ├── types/        # Type definitions
│   ├── utils/        # Utilities
│   └── validations/  # Input schemas
├── activities.ts     # Temporal activities
├── workflow.ts       # Main workflow
└── index.ts         # Entry point
```

## 🚦 Usage

Run workflow:

```bash
pnpm run start
```

## 🛡️ Error Handling

- 🔄 Fallback responses
- 📝 Detailed logging
- 📈 Metric tracking

## 🤝 Contributing

1. Fork it
2. Create feature branch
   ```bash
   git checkout -b feature/cool-feature
   ```
3. Commit changes
   ```bash
   git commit -m 'feat: add cool feature'
   ```
4. Push branch
   ```bash
   git push origin feature/cool-feature
   ```
5. Create Pull Request

## 📄 License

MIT © Mohammad Bekran

## 🙏 Acknowledgments

- [Temporal.io](https://temporal.io)
- [OpenAI](https://openai.com)
- [Twilio](https://twilio.com)
- [Google Maps Platform](https://cloud.google.com/maps-platform)

---

Made with ❤️ by Mohammad Bekran
