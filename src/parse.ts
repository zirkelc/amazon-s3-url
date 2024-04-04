import {
	S3_DASH_REGION_PATH_STYLE_REGEX,
	S3_DASH_REGION_VIRTUAL_HOST_STYLE_REGEX,
	S3_DOT_REGION_PATH_STYLE_REGEX,
	S3_DOT_REGION_VIRTUAL_HOST_STYLE_REGEX,
	S3_GLOBAL_PATH_STYLE_REGEX,
	S3_LEGACY_PATH_STYLE_REGEX,
	S3_LEGACY_VIRTUAL_HOST_STYLE_REGEX,
	isGlobalPathStyle,
	isLegacyPathStyle,
	isLegacyVirtualHostStyle,
	isRegionPathStyle,
	isRegionVirtualHostStyle,
} from "./check.js";
import { S3Object, S3UrlFormat } from "./types.js";

function assertBucket(bucket: unknown): asserts bucket is string {
	if (typeof bucket !== "string" || bucket.length === 0)
		throw new Error(`Invalid S3 bucket: ${bucket}`);
}

function assertKey(key: unknown): asserts key is string {
	if (typeof key !== "string" || key.length === 0)
		throw new Error(`Invalid S3 key: ${key}`);
}

function assertRegion(region: unknown): asserts region is string {
	if (typeof region !== "string" || region.length === 0)
		throw new Error(`Invalid S3 region: ${region}`);
}

function assertUrl(url: unknown): asserts url is string {
	try {
		new URL(url as string);
	} catch (err) {
		throw new Error(`Invalid URL: ${url}`);
	}
}

const parseGlobalPathStyle = (s3url: string): S3Object => {
	const match = s3url.match(S3_GLOBAL_PATH_STYLE_REGEX);
	if (!match) throw new Error(`Invalid S3 path-style URL: ${s3url}`);

	const { bucket, key } = match.groups!;
	assertBucket(bucket);
	assertKey(key);

	return { bucket, key };
};

const parseRegionPathStyle = (s3url: string): S3Object => {
	const match = S3_DOT_REGION_PATH_STYLE_REGEX.test(s3url)
		? // s3.<region-name>.amazonaws.com/<bucket-name>/<key-name>
		  s3url.match(S3_DOT_REGION_PATH_STYLE_REGEX)
		: // s3-<region-name>.amazonaws.com/<bucket-name>/<key-name>
		  s3url.match(S3_DASH_REGION_PATH_STYLE_REGEX);
	if (!match) throw new Error(`Invalid S3 path-style URL: ${s3url}`);

	const { bucket, key, region } = match.groups!;
	assertBucket(bucket);
	assertKey(key);
	assertRegion(region);

	return { bucket, key, region };
};

const parseLegacyPathStyle = (s3url: string): S3Object => {
	const match = s3url.match(S3_LEGACY_PATH_STYLE_REGEX);
	if (!match) throw new Error(`Invalid S3 path-style URL: ${s3url}`);

	const { bucket, key } = match.groups!;
	assertBucket(bucket);
	assertKey(key);

	return { bucket, key };
};

const parseRegionVirtualHostStyle = (s3url: string): S3Object => {
	const match = S3_DOT_REGION_VIRTUAL_HOST_STYLE_REGEX.test(s3url)
		? // <bucket-name>.s3.<region-name>.amazonaws.com/<key-name>
		  s3url.match(S3_DOT_REGION_VIRTUAL_HOST_STYLE_REGEX)
		: // <bucket-name>.s3-<region-name>.amazonaws.com/<key-name>
		  s3url.match(S3_DASH_REGION_VIRTUAL_HOST_STYLE_REGEX);
	if (!match) throw new Error(`Invalid S3 virtual-hosted-style URL: ${s3url}`);

	const { bucket, key, region } = match.groups!;
	assertBucket(bucket);
	assertKey(key);
	assertRegion(region);

	return { bucket, key, region };
};

const parseLegacyVirtualHostStyle = (s3url: string): S3Object => {
	const match = s3url.match(S3_LEGACY_VIRTUAL_HOST_STYLE_REGEX);
	if (!match) throw new Error(`Invalid S3 virtual-hosted-style URL: ${s3url}`);

	const { bucket, key } = match.groups!;
	assertBucket(bucket);
	assertKey(key);

	return { bucket, key };
};

/**
 * Parse an S3 URL into an S3 object.
 * If the format is not specified, the function will attempt to detect the format.
 * If the format is specified, the function will only parse the URL if it matches the format.
 */
export const parseS3Url = (s3url: string, format?: S3UrlFormat): S3Object => {
	assertUrl(s3url);

	switch (format) {
		case undefined:
			if (isRegionPathStyle(s3url)) return parseRegionPathStyle(s3url);

			if (isRegionVirtualHostStyle(s3url))
				return parseRegionVirtualHostStyle(s3url);

			if (isLegacyPathStyle(s3url)) return parseLegacyPathStyle(s3url);

			if (isLegacyVirtualHostStyle(s3url))
				return parseLegacyVirtualHostStyle(s3url);

			if (isGlobalPathStyle(s3url)) return parseGlobalPathStyle(s3url);

			throw new Error(`S3 URL does not match any format`);

		case "s3-global-path":
			if (isGlobalPathStyle(s3url)) return parseGlobalPathStyle(s3url);
			throw new Error(`S3 URL does not match format: ${format}`);

		case "s3-legacy-path":
			if (isLegacyPathStyle(s3url)) return parseLegacyPathStyle(s3url);
			throw new Error(`S3 URL does not match format: ${format}`);

		case "s3-legacy-virtual-host":
			if (isLegacyVirtualHostStyle(s3url))
				return parseLegacyVirtualHostStyle(s3url);
			throw new Error(`S3 URL does not match format: ${format}`);

		case "https-legacy-path":
			if (isLegacyPathStyle(s3url)) return parseLegacyPathStyle(s3url);
			throw new Error(`S3 URL does not match format: ${format}`);

		case "https-legacy-virtual-host":
			if (isLegacyVirtualHostStyle(s3url))
				return parseLegacyVirtualHostStyle(s3url);
			throw new Error(`S3 URL does not match format: ${format}`);

		case "s3-region-path":
			if (isRegionPathStyle(s3url)) return parseRegionPathStyle(s3url);
			throw new Error(`S3 URL does not match format: ${format}`);

		case "s3-region-virtual-host":
			if (isRegionVirtualHostStyle(s3url))
				return parseRegionVirtualHostStyle(s3url);
			throw new Error(`S3 URL does not match format: ${format}`);

		case "https-region-path":
			if (isRegionPathStyle(s3url)) return parseRegionPathStyle(s3url);
			throw new Error(`S3 URL does not match format: ${format}`);

		case "https-region-virtual-host":
			if (isRegionVirtualHostStyle(s3url))
				return parseRegionVirtualHostStyle(s3url);
			throw new Error(`S3 URL does not match format: ${format}`);

		default:
			format satisfies never;
			throw new Error(`Unknown S3 URL format: ${format}`);
	}
};
