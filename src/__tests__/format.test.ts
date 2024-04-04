import { describe, expect, test } from "vitest";
import { formatS3Url } from "../index.js";
import {
	Test,
	globalUrls,
	httpDashRegionPathStyle,
	httpDashRegionVirtualHostedStyle,
	httpDotRegionPathStyle,
	httpDotRegionVirtualHostedStyle,
	legacyUrls,
	regionalUrls,
	s3DashRegionPathStyle,
	s3DashRegionVirtualHostedStyle,
	s3DotRegionPathStyle,
	s3DotRegionVirtualHostedStyle,
	s3GlobalObject,
	s3RegionObject,
} from "./fixtures/index.js";

describe.todo("add type tests");

describe("formatS3Url", () => {
	test.each<Test>(globalUrls)(
		"should format url: $url",
		async ({ format, object, url }) => {
			expect(formatS3Url(object)).toBe(url);
			expect(formatS3Url(object, format)).toBe(url);
		},
	);

	test.each<Test>(legacyUrls)(
		"should format regional url: $url",
		async ({ format, object, url }) => {
			expect(formatS3Url(object)).not.toBe(url); //! not
			expect(formatS3Url(object, format)).toBe(url);
		},
	);

	test.each<Test>([
		{
			format: "s3-region-path",
			url: s3DotRegionPathStyle,
			object: s3RegionObject,
		},
		{
			format: "s3-region-virtual-host",
			url: s3DotRegionVirtualHostedStyle,
			object: s3RegionObject,
		},
		{
			format: "https-region-path",
			url: httpDotRegionPathStyle,
			object: s3RegionObject,
		},
		{
			format: "https-region-virtual-host",
			url: httpDotRegionVirtualHostedStyle,
			object: s3RegionObject,
		},
	])("should format regional url: $url", async ({ format, object, url }) => {
		// formatS3Url only supports the s3.region style, not the s3-region style
		expect(formatS3Url(object)).not.toBe(url); //! not
		expect(formatS3Url(object, format)).toBe(url);
	});

	test.each(["", " ", null, undefined, true, false, 0, 1, [], {}, () => {}])(
		"should throw an error for invalid bucket: %s",
		(bucket) => {
			expect(() =>
				formatS3Url({ ...s3GlobalObject, bucket: bucket as any }),
			).toThrow();
		},
	);

	test.each(["", " ", null, undefined, true, false, 0, 1, [], {}, () => {}])(
		"should throw an error for invalid key: %s",
		(key) => {
			expect(() =>
				formatS3Url({ ...s3GlobalObject, key: key as any }),
			).toThrow();
		},
	);

	test.each(["", " ", null, undefined, true, false, 0, 1, [], {}, () => {}])(
		"should throw an error for invalid region: %s",
		(region) => {
			expect(() =>
				formatS3Url(
					{ ...s3RegionObject, region: region as any },
					"s3-region-path",
				),
			).toThrow();
			expect(() =>
				formatS3Url(
					{ ...s3RegionObject, region: region as any },
					"s3-region-virtual-host",
				),
			).toThrow();
			expect(() =>
				formatS3Url(
					{ ...s3RegionObject, region: region as any },
					"https-region-path",
				),
			).toThrow();
			expect(() =>
				formatS3Url(
					{ ...s3RegionObject, region: region as any },
					"https-region-virtual-host",
				),
			).toThrow();
		},
	);

	test("should throw an error for unknown format", () => {
		expect(() => formatS3Url(s3GlobalObject, "unknown" as any)).toThrow();
	});
});
