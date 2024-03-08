import { S3Object, S3UrlFormat, S3UrlProtocol } from "./types.js";

function assertBucket(bucket: unknown): asserts bucket is string {
	if (typeof bucket !== "string" || bucket.trim().length === 0)
		throw new Error(`Invalid S3 bucket: ${bucket}`);
}

function assertKey(key: unknown): asserts key is string {
	if (typeof key !== "string" || key.trim().length === 0)
		throw new Error(`Invalid S3 key: ${key}`);
}

function assertRegion(region: unknown): asserts region is string {
	if (typeof region !== "string" || region.trim().length === 0)
		throw new Error(`Invalid S3 region: ${region}`);
}

// TODO add validation for region, bucket, and key
// https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html

const formatPath = (s3Object: S3Object): string => {
	const { bucket, key } = s3Object;
	assertBucket(bucket);
	assertKey(key);

	return `${bucket}/${key}`;
};

const formatGlobalPath = (s3Object: S3Object): string => {
	return `s3://${formatPath(s3Object)}`;
};

const formatLegacyPath = (
	s3Object: S3Object,
	protocol: S3UrlProtocol,
): string => {
	return `${protocol}://s3.amazonaws.com/${formatPath(s3Object)}`;
};

const formatRegionPath = (
	s3Object: S3Object,
	protocol: S3UrlProtocol,
): string => {
	const { region } = s3Object;
	assertRegion(region);

	return `${protocol}://s3.${region}.amazonaws.com/${formatPath(s3Object)}`;
};

const formatLegacyVirtualHostStyle = (
	s3Object: S3Object,
	protocol: S3UrlProtocol,
): string => {
	const { bucket, key } = s3Object;
	assertBucket(bucket);
	assertKey(key);

	return `${protocol}://${bucket}.s3.amazonaws.com/${key}`;
};

const formatRegionVirtualHostStyle = (
	s3Object: S3Object,
	protocol: S3UrlProtocol,
): string => {
	const { bucket, key, region } = s3Object;
	assertBucket(bucket);
	assertKey(key);
	assertRegion(region);

	return `${protocol}://${bucket}.s3.${region}.amazonaws.com/${key}`;
};

export const formatS3Url = (
	s3Object: S3Object,
	format?: S3UrlFormat,
): string => {
	switch (format) {
		case undefined:
			return formatGlobalPath(s3Object);

		case "s3-global-path":
			return formatGlobalPath(s3Object);

		case "s3-legacy-path":
			return formatLegacyPath(s3Object, "s3");

		case "s3-legacy-virtual-host":
			return formatLegacyVirtualHostStyle(s3Object, "s3");

		case "https-legacy-path":
			return formatLegacyPath(s3Object, "https");

		case "https-legacy-virtual-host":
			return formatLegacyVirtualHostStyle(s3Object, "https");

		case "s3-region-path":
			return formatRegionPath(s3Object, "s3");

		case "s3-region-virtual-host":
			return formatRegionVirtualHostStyle(s3Object, "s3");

		case "https-region-path":
			return formatRegionPath(s3Object, "https");

		case "https-region-virtual-host":
			return formatRegionVirtualHostStyle(s3Object, "https");

		default:
			format satisfies never;
			throw new Error(`Unknown S3 URL format: ${format}`);
	}
};
