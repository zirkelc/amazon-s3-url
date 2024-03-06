import { describe, expect, test } from "vitest";
import {
	S3Object,
	S3UrlFormat,
	formatS3Url,
	isS3Url,
	parseS3Url,
} from "./index.js";

const s3GlobalPathStyle = "s3://my-bucket/key-1/key-2";

const s3LegacyPathStyle = "s3://s3.amazonaws.com/my-bucket/key-1/key-2";
const s3LegacyVirtualHostedStyle =
	"s3://my-bucket.s3.amazonaws.com/key-1/key-2";
const httpLegacyPathStyle = "https://s3.amazonaws.com/my-bucket/key-1/key-2";
const httpLegacyVirtualHostedStyle =
	"https://my-bucket.s3.amazonaws.com/key-1/key-2";

const s3RegionPathStyle =
	"s3://s3.us-west-1.amazonaws.com/my-bucket/key-1/key-2";
const s3RegionVirtualHostedStyle =
	"s3://my-bucket.s3.us-west-1.amazonaws.com/key-1/key-2";
const httpRegionPathStyle =
	"https://s3.us-west-1.amazonaws.com/my-bucket/key-1/key-2";
const httpRegionVirtualHostedStyle =
	"https://my-bucket.s3.us-west-1.amazonaws.com/key-1/key-2";

const s3GlobalObject: S3Object = {
	bucket: "my-bucket",
	key: "key-1/key-2",
};

const s3RegionObject: S3Object = {
	bucket: "my-bucket",
	key: "key-1/key-2",
	region: "us-west-1",
};

type Test = {
	format?: S3UrlFormat;
	url: string;
	object: S3Object;
};

describe.todo("add negative tests");
describe.todo("add type tests");

describe("isS3Url", () => {
	test.each([s3GlobalPathStyle])(
		"should return true for global url: %s",
		async (url) => {
			expect(isS3Url(url)).toBe(true);
		},
	);

	test.each([
		s3LegacyPathStyle,
		s3LegacyVirtualHostedStyle,
		httpLegacyPathStyle,
		httpLegacyVirtualHostedStyle,
	])("should return true for legacy url: %s", async (url) => {
		expect(isS3Url(url)).toBe(true);
	});

	test.each([
		s3RegionPathStyle,
		s3RegionVirtualHostedStyle,
		httpRegionPathStyle,
		httpRegionVirtualHostedStyle,
	])("should return true for region-specific url: %s", async (url) => {
		expect(isS3Url(url)).toBe(true);
	});
});

describe("parseS3Url", () => {
	test.each<Test>([
		{ format: undefined, url: s3GlobalPathStyle, object: s3GlobalObject },
		{
			format: "s3-global-path",
			url: s3GlobalPathStyle,
			object: s3GlobalObject,
		},
	])("should parse global url: $url", async ({ format, url, object }) => {
		expect(parseS3Url(url, format)).toEqual(object);
	});

	test.each<Test>([
		{ format: undefined, url: s3LegacyPathStyle, object: s3GlobalObject },
		{
			format: undefined,
			url: s3LegacyVirtualHostedStyle,
			object: s3GlobalObject,
		},
		{ format: undefined, url: httpLegacyPathStyle, object: s3GlobalObject },
		{
			format: undefined,
			url: httpLegacyVirtualHostedStyle,
			object: s3GlobalObject,
		},
		{
			format: "s3-legacy-path",
			url: s3LegacyPathStyle,
			object: s3GlobalObject,
		},
		{
			format: "s3-legacy-virtual-host",
			url: s3LegacyVirtualHostedStyle,
			object: s3GlobalObject,
		},
		{
			format: "https-legacy-path",
			url: httpLegacyPathStyle,
			object: s3GlobalObject,
		},
		{
			format: "https-legacy-virtual-host",
			url: httpLegacyVirtualHostedStyle,
			object: s3GlobalObject,
		},
	])("should parse legacy url: $url", async ({ format, url, object }) => {
		expect(parseS3Url(url, format)).toEqual(object);
	});

	test.each<Test>([
		{ format: undefined, url: s3RegionPathStyle, object: s3RegionObject },
		{
			format: undefined,
			url: s3RegionVirtualHostedStyle,
			object: s3RegionObject,
		},
		{ format: undefined, url: httpRegionPathStyle, object: s3RegionObject },
		{
			format: undefined,
			url: httpRegionVirtualHostedStyle,
			object: s3RegionObject,
		},
		{
			format: "s3-region-path",
			url: s3RegionPathStyle,
			object: s3RegionObject,
		},
		{
			format: "s3-region-virtual-host",
			url: s3RegionVirtualHostedStyle,
			object: s3RegionObject,
		},
		{
			format: "https-region-path",
			url: httpRegionPathStyle,
			object: s3RegionObject,
		},
		{
			format: "https-region-virtual-host",
			url: httpRegionVirtualHostedStyle,
			object: s3RegionObject,
		},
	])(
		"should parse region-specific url: $url",
		async ({ format, url, object }) => {
			expect(parseS3Url(url, format)).toEqual(object);
		},
	);
});

describe("formatS3Url", () => {
	test.each<Test>([
		{ format: undefined, url: s3GlobalPathStyle, object: s3GlobalObject },
		{
			format: "s3-global-path",
			url: s3GlobalPathStyle,
			object: s3GlobalObject,
		},
	])("should format global url: $url", async ({ format, object, url }) => {
		expect(formatS3Url(object, format)).toBe(url);
	});

	test.each<Test>([
		{
			format: "s3-legacy-path",
			url: s3LegacyPathStyle,
			object: s3GlobalObject,
		},
		{
			format: "s3-legacy-virtual-host",
			url: s3LegacyVirtualHostedStyle,
			object: s3GlobalObject,
		},
		{
			format: "https-legacy-path",
			url: httpLegacyPathStyle,
			object: s3GlobalObject,
		},
		{
			format: "https-legacy-virtual-host",
			url: httpLegacyVirtualHostedStyle,
			object: s3GlobalObject,
		},
	])("should format legacy url: $url", async ({ format, object, url }) => {
		expect(formatS3Url(object, format)).toBe(url);
	});

	test.each<Test>([
		{
			format: "s3-region-path",
			url: s3RegionPathStyle,
			object: s3RegionObject,
		},
		{
			format: "s3-region-virtual-host",
			url: s3RegionVirtualHostedStyle,
			object: s3RegionObject,
		},
		{
			format: "https-region-path",
			url: httpRegionPathStyle,
			object: s3RegionObject,
		},
		{
			format: "https-region-virtual-host",
			url: httpRegionVirtualHostedStyle,
			object: s3RegionObject,
		},
	])(
		"should format region-specific url: $url",
		async ({ format, object, url }) => {
			expect(formatS3Url(object, format)).toBe(url);
		},
	);
});
