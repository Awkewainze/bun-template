import type { ValueType } from "@/types";

export type Guid = ValueType<string, "Guid">;
export type UserId = ValueType<string, "UserId">;
export type CorrelationId = ValueType<string, "CorrelationId">;

export type EncodedJWT = ValueType<string, "EncodedJWT">;
export type Name = ValueType<string, "Name">
export type Username = ValueType<string, "Username">;
export type Password = ValueType<string, "Password">;

export type CSRFToken = ValueType<string, "CSRFToken">;
