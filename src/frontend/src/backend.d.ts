import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Session {
    season: string;
    familyStats: Array<[string, VoteStats]>;
    colors: Array<[Color, boolean]>;
}
export interface VoteStats {
    votes: bigint;
    likes: bigint;
}
export interface Color {
    hex: string;
    name: string;
    family: string;
}
export interface backendInterface {
    addVote(sessionId: string, color: Color, liked: boolean): Promise<void>;
    createSession(sessionId: string): Promise<void>;
    getAllSessions(): Promise<Array<Session>>;
    getLikedColors(sessionId: string): Promise<Array<Color>>;
    getRecommendedFamily(sessionId: string): Promise<string>;
    getSession(sessionId: string): Promise<Session>;
    setSeason(sessionId: string, season: string): Promise<void>;
}
