import { describe, expect, test } from "vitest";
import { isS3Url } from "../index.js";
import {
	globalUrls,
	invalidGlobalUrls,
	invalidLegacyUrls,
	invalidRegionUrls,
	invalidUrls,
	legacyUrls,
	regionalUrls,
	s3GlobalPathStyle,
} from "./fixtures/index.js";

describe.todo("add negative tests");
describe.todo("add type tests");

describe("isS3Url", () => {
	test.each(globalUrls)(
		"should return true for valid global url: $url",
		async ({ url, format }) => {
			expect(isS3Url(url)).toBe(true);
			expect(isS3Url(url, format)).toBe(true);
		},
	);

	test.each(legacyUrls)(
		"should return true for valid legacy url: $url",
		async ({ url, format }) => {
			expect(isS3Url(url)).toBe(true);
			expect(isS3Url(url, format)).toBe(true);
		},
	);

	test.each(regionalUrls)(
		"should return true for valid regional url: $url",
		async ({ url, format }) => {
			expect(isS3Url(url)).toBe(true);
			expect(isS3Url(url, format)).toBe(true);
		},
	);

	test.each(invalidGlobalUrls)(
		"should return false for invalid global url: %s",
		async (url) => {
			expect(isS3Url(url)).toBe(false);
			expect(isS3Url(url, "s3-global-path")).toBe(false);
		},
	);

	test.each(invalidRegionUrls)(
		"should return false for invalid regional url: %s",
		async (url) => {
			// expect(isS3Url(url)).toBe(false);
			expect(isS3Url(url, "s3-legacy-path")).toBe(false);
			expect(isS3Url(url, "s3-legacy-virtual-host")).toBe(false);
			expect(isS3Url(url, "https-legacy-path")).toBe(false);
			expect(isS3Url(url, "https-legacy-virtual-host")).toBe(false);
		},
	);

	test.each(invalidLegacyUrls)(
		"should return false for invalid legacy url: %s",
		async (url) => {
			// expect(isS3Url(url)).toBe(false);
			expect(isS3Url(url, "s3-legacy-path")).toBe(false);
			expect(isS3Url(url, "s3-legacy-virtual-host")).toBe(false);
			expect(isS3Url(url, "https-legacy-path")).toBe(false);
			expect(isS3Url(url, "https-legacy-virtual-host")).toBe(false);
		},
	);

	test.each(invalidUrls)("should return false for invalid url: %s", (url) => {
		expect(isS3Url(url)).toBe(false);
	});

	test("should throw an error for unknown format", () => {
		expect(() => isS3Url(s3GlobalPathStyle, "unknown" as any)).toThrow();
	});
});
