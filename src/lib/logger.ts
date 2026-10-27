export const logger = {
  info: (meta: Record<string, any>, message: string) => {
    console.log(JSON.stringify({ level: "INFO", timestamp: new Date().toISOString(), ...meta, message }));
  },
  warn: (meta: Record<string, any>, message: string) => {
    console.warn(JSON.stringify({ level: "WARN", timestamp: new Date().toISOString(), ...meta, message }));
  },
  error: (meta: Record<string, any>, message: string) => {
    console.error(JSON.stringify({ level: "ERROR", timestamp: new Date().toISOString(), ...meta, message }));
  }
};
