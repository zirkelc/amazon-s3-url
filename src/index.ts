/**
 * Amazon S3 supports multiple URL formats for accessing objects in a bucket.
 * There are two main types of URL formats: path-style and virtual-hosted-style.
 *
 * Path-style format:
 *  `s3.<region-name>.amazonaws.com/<bucket-name>/<key-name>`
 *
 * Virtual-hosted-style format:
 *  `<bucket-name>.s3.<region-code>.amazonaws.com/<key-name>`
 *
 * The virtual-hosted-style format is recommended for all new Amazon S3 buckets.
 * Furthermore, there are two protocols for the URL: `s3` and `https`.
 *
 * @see https://docs.aws.amazon.com/general/latest/gr/s3.html
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html
 */
export type S3UrlFormat =
	| "s3-global-path"
	| "s3-legacy-path"
	| "s3-legacy-virtual-host"
	| "s3-region-path"
	| "s3-region-virtual-host"
	| "https-legacy-path"
	| "https-legacy-virtual-host"
	| "https-region-path"
	| "https-region-virtual-host";

type S3UrlProtocol = "s3" | "https";

export type S3Object = {
	bucket: string;
	key: string;
	region?: string;
};

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

// TODO add validation for region, bucket, and key
// https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html

/**
 * s3://<bucket-name>/<key-name>
 */
const GLOBAL_PATH_STYLE_REGEX = /^s3:\/\/(?<bucket>[^/]+)\/(?<key>.+)$/;

/**
 * <s3|https>://s3.amazonaws.com/<bucket-name>/<key-name>
 */
const LEGACY_PATH_STYLE_REGEX =
	/^(?<protocol>(s3|https)):\/\/s3\.amazonaws\.com\/(?<bucket>[^/]+)\/(?<key>.+)$/;

/**
 * <s3|https>://s3.<region-name>.amazonaws.com/<bucket-name>/<key-name>
 */
const REGION_PATH_STYLE_REGEX =
	/^(?<protocol>(s3|https)):\/\/s3\.(?<region>[^.]+)\.amazonaws\.com\/(?<bucket>[^/]+)\/(?<key>.+)$/;

/**
 * <s3|https>://<bucket-name>.s3.amazonaws.com/<key-name>
 */
const LEGACY_VIRTUAL_HOST_STYLE_REGEX =
	/^(?<protocol>(s3|https)):\/\/(?<bucket>[^.]+)\.s3\.amazonaws\.com\/(?<key>.+)$/;

/**
 * <s3|https>://<bucket-name>.s3.<region-name>.amazonaws.com/<key-name>
 */
const REGION_VIRTUAL_HOST_STYLE_REGEX =
	/^(?<protocol>(s3|https)):\/\/(?<bucket>[^.]+)\.s3\.(?<region>[^.]+)\.amazonaws\.com\/(?<key>.+)$/;

/**
 * Returns true if the given S3 URL is in path-style format.
 * @param s3url
 * @returns
 */
const isGlobalPathStyle = (s3url: string): boolean => {
	return GLOBAL_PATH_STYLE_REGEX.test(s3url);
};

const isRegionPathStyle = (s3url: string): boolean => {
	return REGION_PATH_STYLE_REGEX.test(s3url);
};

const isLegacyPathStyle = (s3url: string): boolean => {
	return LEGACY_PATH_STYLE_REGEX.test(s3url);
};

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

const parseGlobalPathStyle = (s3url: string): S3Object => {
	const match = s3url.match(GLOBAL_PATH_STYLE_REGEX);
	if (!match) throw new Error(`Invalid S3 path-style URL: ${s3url}`);

	const { bucket, key } = match.groups!;
	assertBucket(bucket);
	assertKey(key);

	return { bucket, key };
};

const parseRegionPathStyle = (s3url: string): S3Object => {
	const match = s3url.match(REGION_PATH_STYLE_REGEX);
	if (!match) throw new Error(`Invalid S3 path-style URL: ${s3url}`);

	const { bucket, key, region } = match.groups!;
	assertBucket(bucket);
	assertKey(key);
	assertRegion(region);

	return { bucket, key, region };
};

const parseLegacyPathStyle = (s3url: string): S3Object => {
	const match = s3url.match(LEGACY_PATH_STYLE_REGEX);
	if (!match) throw new Error(`Invalid S3 path-style URL: ${s3url}`);

	const { bucket, key } = match.groups!;
	assertBucket(bucket);
	assertKey(key);

	return { bucket, key };
};

const isRegionVirtualHostStyle = (s3url: string): boolean => {
	return REGION_VIRTUAL_HOST_STYLE_REGEX.test(s3url);
};

const isLegacyVirtualHostStyle = (s3url: string): boolean => {
	return LEGACY_VIRTUAL_HOST_STYLE_REGEX.test(s3url);
};

const isUrl = (url: unknown): url is string => {
	try {
		new URL(url as string);
		return true;
	} catch (err) {
		return false;
	}
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

const parseRegionVirtualHostStyle = (s3url: string): S3Object => {
	const match = s3url.match(REGION_VIRTUAL_HOST_STYLE_REGEX);
	if (!match) throw new Error(`Invalid S3 virtual-hosted-style URL: ${s3url}`);

	const { bucket, key, region } = match.groups!;
	assertBucket(bucket);
	assertKey(key);
	assertRegion(region);

	return { bucket, key, region };
};

const parseLegacyVirtualHostStyle = (s3url: string): S3Object => {
	const match = s3url.match(LEGACY_VIRTUAL_HOST_STYLE_REGEX);
	if (!match) throw new Error(`Invalid S3 virtual-hosted-style URL: ${s3url}`);

	const { bucket, key } = match.groups!;
	assertBucket(bucket);
	assertKey(key);

	return { bucket, key };
};

export const isS3Url = (
	s3url: unknown,
	format?: S3UrlFormat,
): s3url is string => {
	if (!isUrl(s3url)) return false;

	switch (format) {
		case undefined:
			// check global path-style last because it's the most generic and `s3.amazonaws.com` is a valid bucket name
			return (
				isRegionPathStyle(s3url) ||
				isRegionVirtualHostStyle(s3url) ||
				isLegacyPathStyle(s3url) ||
				isLegacyVirtualHostStyle(s3url) ||
				isGlobalPathStyle(s3url)
			);

		case "s3-global-path":
			return isGlobalPathStyle(s3url);

		case "s3-legacy-path":
			return isLegacyPathStyle(s3url);

		case "s3-legacy-virtual-host":
			return isLegacyVirtualHostStyle(s3url);

		case "https-legacy-path":
			return isLegacyPathStyle(s3url);

		case "https-legacy-virtual-host":
			return isLegacyVirtualHostStyle(s3url);

		case "s3-region-path":
			return isRegionPathStyle(s3url);

		case "s3-region-virtual-host":
			return isRegionVirtualHostStyle(s3url);

		case "https-region-path":
			return isRegionPathStyle(s3url);

		case "https-region-virtual-host":
			return isRegionVirtualHostStyle(s3url);

		default:
			format satisfies never;
			throw new Error(`Unknown S3 URL format: ${format}`);
	}
};

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
