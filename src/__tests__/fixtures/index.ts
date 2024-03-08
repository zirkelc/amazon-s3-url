import { S3Object, S3UrlFormat } from "../../types.js";

export const s3GlobalPathStyle = "s3://my-bucket/key-1/key-2";
export const s3LegacyPathStyle = "s3://s3.amazonaws.com/my-bucket/key-1/key-2";
export const s3LegacyVirtualHostedStyle =
	"s3://my-bucket.s3.amazonaws.com/key-1/key-2";
export const httpLegacyPathStyle =
	"https://s3.amazonaws.com/my-bucket/key-1/key-2";
export const httpLegacyVirtualHostedStyle =
	"https://my-bucket.s3.amazonaws.com/key-1/key-2";
export const s3RegionPathStyle =
	"s3://s3.us-west-1.amazonaws.com/my-bucket/key-1/key-2";
export const s3RegionVirtualHostedStyle =
	"s3://my-bucket.s3.us-west-1.amazonaws.com/key-1/key-2";
export const httpRegionPathStyle =
	"https://s3.us-west-1.amazonaws.com/my-bucket/key-1/key-2";
export const httpRegionVirtualHostedStyle =
	"https://my-bucket.s3.us-west-1.amazonaws.com/key-1/key-2";

export const s3GlobalObject: S3Object = {
	bucket: "my-bucket",
	key: "key-1/key-2",
};

export const s3RegionObject: S3Object = {
	bucket: "my-bucket",
	key: "key-1/key-2",
	region: "us-west-1",
};

export const invalidGlobalUrls = [
	"s3://",
	"s3:///",
	"s3://bucket",
	"s3://bucket/",
];

export const invalidLegacyUrls = [
	// legacy path-style
	"s3://s3.amazonaws.com",
	"s3://s3.amazonaws.com/",
	"s3://s3.amazonaws.com/bucket",
	"s3://s3.amazonaws.com/bucket/",
	// legacy virtual-hosted-style
	"s3://bucket.s3.amazonaws.com",
	"s3://bucket.s3.amazonaws.com/",
	// http legacy path-style
	"https://s3.amazonaws.com",
	"https://s3.amazonaws.com/",
	"https://s3.amazonaws.com/bucket",
	"https://s3.amazonaws.com/bucket/",
	// http legacy virtual-hosted-style
	"https://bucket.s3.amazonaws.com",
	"https://bucket.s3.amazonaws.com/",
];

export const invalidRegionUrls = [
	// region path-style
	"s3://s3.us-west-1.amazonaws.com",
	"s3://s3.us-west-1.amazonaws.com/",
	"s3://s3.us-west-1.amazonaws.com/bucket",
	"s3://s3.us-west-1.amazonaws.com/bucket/",
	// region virtual-hosted-style
	"s3://bucket.s3.us-west-1.amazonaws.com",
	"s3://bucket.s3.us-west-1.amazonaws.com/",
	// http region path-style
	"https://s3.us-west-1.amazonaws.com",
	"https://s3.us-west-1.amazonaws.com/",
	"https://s3.us-west-1.amazonaws.com/bucket",
	"https://s3.us-west-1.amazonaws.com/bucket/",
	// http region virtual-hosted-style
	"https://bucket.s3.us-west-1.amazonaws.com",
	"https://bucket.s3.us-west-1.amazonaws.com/",
];

export const invalidUrls = [
	"",
	null,
	undefined,
	true,
	false,
	0,
	1,
	[],
	{},
	() => {},
];

export type Test = {
	format?: S3UrlFormat;
	url: string;
	object: S3Object;
};

export const globalUrls: Test[] = [
	{ format: undefined, url: s3GlobalPathStyle, object: s3GlobalObject },
	{
		format: "s3-global-path",
		url: s3GlobalPathStyle,
		object: s3GlobalObject,
	},
];

export const regionalUrls: Test[] = [
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
];

export const legacyUrls: Test[] = [
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
];
