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
 *
 * In regional URLs, the region is specified as `s3.<region-name>.amazonaws.com`.
 * Some older region support the `s3-<region-name>.amazonaws.com` format
 * with a dash `-` instead of a dot `.` between `s3` and the region name.
 *
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

export type S3UrlProtocol = "s3" | "https";

export type S3Object = {
	bucket: string;
	key: string;
	region?: string;
};
