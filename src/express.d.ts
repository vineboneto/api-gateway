declare module Express {
  interface Request {
    locals?: {
      service?: string;
      tenancyId?: number;
    };
  }
}
