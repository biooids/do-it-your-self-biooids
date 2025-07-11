import { Prisma } from "../../prisma/generated/prisma";
export { SystemRole } from "../../prisma/generated/prisma";
declare const prisma: import("prisma/generated/prisma/runtime/library").DynamicClientExtensionThis<Prisma.TypeMap<import("prisma/generated/prisma/runtime/library").InternalArgs & {
    result: {};
    model: {};
    query: {};
    client: {};
}, {}>, Prisma.TypeMapCb<{
    log: ("info" | "query" | "warn" | "error")[];
}>, {
    result: {};
    model: {};
    query: {};
    client: {};
}>;
export declare function connectPrisma(retriesLeft?: number): Promise<void>;
export default prisma;
export declare function disconnectPrisma(): Promise<void>;
//# sourceMappingURL=prisma.d.ts.map