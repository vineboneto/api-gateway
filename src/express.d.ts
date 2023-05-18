declare module Express {
  interface Request {
    locals?: {
      service?: string;
      serviceId?: number;
    };
  }
}
