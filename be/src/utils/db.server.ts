import {PrismaClient} from '@prisma/client';

const globalAny: any = global

declare global {
  let __db: PrismaClient | undefined
}

if (!globalAny.__db) {
  globalAny.__db = new PrismaClient()
}

const db: PrismaClient = globalAny.__db
export { db }
