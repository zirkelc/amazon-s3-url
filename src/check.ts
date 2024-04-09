import { S3Object, S3UrlFormat, S3UrlProtocol } from "./types.js";

// TODO add validation for region, bucket, and key
// https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html

/**
 * `s3://<bucket-name>/<key-name>`
 */
export const S3_GLOBAL_PATH_STYLE_REGEX =
	/^s3:\/\/(?<bucket>[^/]+)\/(?<key>.+)$/;

/**
 * `<s3|https>://s3.amazonaws.com/<bucket-name>/<key-name>`
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#VirtualHostingBackwardsCompatibility
 */
export const S3_LEGACY_PATH_STYLE_REGEX =
	/^(?<protocol>(s3|https)):\/\/s3\.amazonaws\.com\/(?<bucket>[^/]+)\/(?<key>.+)$/;

/**
 * `<s3|https>://s3.<region-name>.amazonaws.com/<bucket-name>/<key-name>`
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access
 */
export const S3_DOT_REGION_PATH_STYLE_REGEX =
	/^(?<protocol>(s3|https)):\/\/s3\.(?<region>[^.]+)\.amazonaws\.com\/(?<bucket>[^/]+)\/(?<key>.+)$/;

/**
 * `<s3|https>://s3-<region-name>.amazonaws.com/<bucket-name>/<key-name>`
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#VirtualHostingBackwardsCompatibility
 */
export const S3_DASH_REGION_PATH_STYLE_REGEX =
	/^(?<protocol>(s3|https)):\/\/s3-(?<region>[^.]+)\.amazonaws\.com\/(?<bucket>[^/]+)\/(?<key>.+)$/;

/**
 * `<s3|https>://<bucket-name>.s3.amazonaws.com/<key-name>`
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#VirtualHostingBackwardsCompatibility
 */
export const S3_LEGACY_VIRTUAL_HOST_STYLE_REGEX =
	/^(?<protocol>(s3|https)):\/\/(?<bucket>[^.]+)\.s3\.amazonaws\.com\/(?<key>.+)$/;

/**
 * `<s3|https>://<bucket-name>.s3.<region-name>.amazonaws.com/<key-name>`
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#virtual-hosted-style-access
 */
export const S3_DOT_REGION_VIRTUAL_HOST_STYLE_REGEX =
	/^(?<protocol>(s3|https)):\/\/(?<bucket>[^.]+)\.s3\.(?<region>[^.]+)\.amazonaws\.com\/(?<key>.+)$/;

/**
 * `<s3|https>://<bucket-name>.s3-<region-name>.amazonaws.com/<key-name>`
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#virtual-hosted-style-access
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#VirtualHostingBackwardsCompatibility
 */
export const S3_DASH_REGION_VIRTUAL_HOST_STYLE_REGEX =
	/^(?<protocol>(s3|https)):\/\/(?<bucket>[^.]+)\.s3-(?<region>[^.]+)\.amazonaws\.com\/(?<key>.+)$/;

/**
 * Returns true if the given S3 URL is in path-style format.
 * @param s3url
 * @returns
 */
export const isGlobalPathStyle = (s3url: string): boolean => {
	return S3_GLOBAL_PATH_STYLE_REGEX.test(s3url);
};

export const isRegionPathStyle = (s3url: string): boolean => {
	return (
		S3_DOT_REGION_PATH_STYLE_REGEX.test(s3url) ||
		S3_DASH_REGION_PATH_STYLE_REGEX.test(s3url)
	);
};

export const isLegacyPathStyle = (s3url: string): boolean => {
	return S3_LEGACY_PATH_STYLE_REGEX.test(s3url);
};

export const isRegionVirtualHostStyle = (s3url: string): boolean => {
	return (
		S3_DOT_REGION_VIRTUAL_HOST_STYLE_REGEX.test(s3url) ||
		S3_DASH_REGION_VIRTUAL_HOST_STYLE_REGEX.test(s3url)
	);
};

export const isLegacyVirtualHostStyle = (s3url: string): boolean => {
	return S3_LEGACY_VIRTUAL_HOST_STYLE_REGEX.test(s3url);
};

export const isUrl = (url: unknown): url is string => {
	try {
		new URL(url as string);
		return true;
	} catch (err) {
		return false;
	}
};

/**
 * Checks if the given URL is a valid S3 URL.
 * If the format is specified, it checks if the URL matches the format.
 * If the format is not specified, it checks if the URL matches any valid S3 URL format.
 */
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
