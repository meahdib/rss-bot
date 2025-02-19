declare global {
  interface ConfigData {
    username: string;
    password: string;
    processPID?: string | null;
    botToken: string;
  }

  interface LogData {
    timestamp: string;
    message: string[];
  }

  interface Config {
    telegram_bot_token: string;
    service_name?: string | null;
    dashboard_port: number;
    secret: string;
    envirnoment: string;
  }
}

export {};
