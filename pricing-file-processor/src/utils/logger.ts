export class Logger {
  static info(message: string, meta?: Record<string, any>): void {
    console.log(
      JSON.stringify({
        level: "INFO",
        message,
        ...meta,
        timestamp: new Date().toISOString(),
      })
    );
  }

  static error(
    message: string,
    error?: Error,
    meta?: Record<string, any>
  ): void {
    console.error(
      JSON.stringify({
        level: "ERROR",
        message,
        error: error?.message,
        stack: error?.stack,
        ...meta,
        timestamp: new Date().toISOString(),
      })
    );
  }

  static warn(message: string, meta?: Record<string, any>): void {
    console.warn(
      JSON.stringify({
        level: "WARN",
        message,
        ...meta,
        timestamp: new Date().toISOString(),
      })
    );
  }

  static debug(message: string, meta?: Record<string, any>): void {
    if (process.env.LOG_LEVEL === "DEBUG") {
      console.debug(
        JSON.stringify({
          level: "DEBUG",
          message,
          ...meta,
          timestamp: new Date().toISOString(),
        })
      );
    }
  }
}
