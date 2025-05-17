namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_MAPS_API_KEY: string;
    DESTINATION: string;
    ORIGIN: string;
    OPENAI_API_KEY: string;
    DELAY_THRESHOLD: string;

    //  Twilio
    TWILIO_SID: string;
    TWILIO_PHONE: string;
    TWILIO_AUTH_TOKEN: string;
    CUSTOMER_PHONE: string;
  }
}
