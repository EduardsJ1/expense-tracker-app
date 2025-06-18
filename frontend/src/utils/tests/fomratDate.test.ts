import {describe, it, expect} from 'vitest';
import {getRelativeDayLabel} from "../formatDate"


describe("it returns today yesterday or number of days before current time", () => {
    const fixedNow = new Date("2025-09-01T12:00:00.000Z");

    it("returns today if the date is today to local", () => {
        const date = "2025-09-01T08:33:01.307Z";
        const result = getRelativeDayLabel(date, fixedNow);
        expect(result).toBe("today");
    });

    it("returns yesterday if the date happened yesterday", () => {
        const date = "2025-08-31T17:33:01.307Z";
        const result = getRelativeDayLabel(date, fixedNow);
        expect(result).toBe("yesterday");
    });

    it("returns 2 days ago if date was 2 days ago", () => {
        const date = "2025-08-30T17:33:01.307Z";
        const result = getRelativeDayLabel(date, fixedNow);
        expect(result).toBe("2 days ago");
    });

    it("returns 3 days ago if date was 3 days ago, crossing months", () => {
        const date = "2025-08-29T17:33:01.307Z";
        const result = getRelativeDayLabel(date, fixedNow);
        expect(result).toBe("3 days ago");
    });

    it("returns 1 day ago if date is 31 Aug and now is 1 Sep", () => {
        const date = "2025-08-31T10:00:00.000Z";
        const result = getRelativeDayLabel(date, fixedNow);
        expect(result).toBe("yesterday");
    });

    it("returns correct days ago for month difference (30 Aug to 1 Sep)", () => {
        const date = "2025-08-30T10:00:00.000Z";
        const result = getRelativeDayLabel(date, fixedNow);
        expect(result).toBe("2 days ago");
    });

    it("returns correct days ago for year difference (31 Dec to 1 Jan)", () => {
        const newYearNow = new Date("2026-01-01T12:00:00.000Z");
        const date = "2025-12-31T10:00:00.000Z";
        const result = getRelativeDayLabel(date, newYearNow);
        expect(result).toBe("yesterday");
    });
});