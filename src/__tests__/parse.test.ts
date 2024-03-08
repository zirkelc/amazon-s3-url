import { describe, expect, test } from "vitest";
import { parseS3Url } from "../index.js";
import {
	Test,
	globalUrls,
	invalidGlobalUrls,
	invalidLegacyUrls,
	invalidRegionUrls,
	invalidUrls,
	legacyUrls,
	regionalUrls,
	s3GlobalPathStyle,
} from "./fixtures/index.js";

describe("parseS3Url", () => {
	test.each<Test>(globalUrls)(
		"should parse global url: $url",
		async ({ format, url, object }) => {
			expect(parseS3Url(url)).toEqual(object);
			expect(parseS3Url(url, format)).toEqual(object);
		},
	);

	test.each<Test>(legacyUrls)(
		"should parse legacy url: $url",
		async ({ format, url, object }) => {
			expect(parseS3Url(url)).toEqual(object);
			expect(parseS3Url(url, format)).toEqual(object);
		},
	);

	test.each<Test>(regionalUrls)(
		"should parse regional url: $url",
		async ({ format, url, object }) => {
			expect(parseS3Url(url)).toEqual(object);
			expect(parseS3Url(url, format)).toEqual(object);
		},
	);

	test.each(invalidGlobalUrls)(
		"should throw an error for invalid global url: %s",
		async (url) => {
			expect(() => parseS3Url(url)).toThrow();
			expect(() => parseS3Url(url, "s3-global-path")).toThrow();
		},
	);

	test.each(invalidRegionUrls)(
		"should throw an error for invalid regional url: %s",
		async (url) => {
			// expect(isS3Url(url)).toBe(false);
			expect(() => parseS3Url(url, "s3-legacy-path")).toThrow();
			expect(() => parseS3Url(url, "s3-legacy-virtual-host")).toThrow();
			expect(() => parseS3Url(url, "https-legacy-path")).toThrow();
			expect(() => parseS3Url(url, "https-legacy-virtual-host")).toThrow();
		},
	);

	test.each(invalidLegacyUrls)(
		"should throw an error for invalid legacy url: %s",
		async (url) => {
			// expect(isS3Url(url)).toBe(false);
			expect(() => parseS3Url(url, "s3-legacy-path")).toThrow();
			expect(() => parseS3Url(url, "s3-legacy-virtual-host")).toThrow();
			expect(() => parseS3Url(url, "https-legacy-path")).toThrow();
			expect(() => parseS3Url(url, "https-legacy-virtual-host")).toThrow();
		},
	);

	test.each(invalidUrls)("should throw an error for invalid url: %s", (url) => {
		expect(() => parseS3Url(url as any)).toThrow();
	});

	test("should throw an error for unknown format", () => {
		expect(() => parseS3Url(s3GlobalPathStyle, "unknown" as any)).toThrow();
	});
});
