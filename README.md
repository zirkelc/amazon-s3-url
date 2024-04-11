[![CI](https://github.com/zirkelc/amazon-s3-url/actions/workflows/ci.yml/badge.svg)](https://github.com/zirkelc/aws-sigv4-fetch/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/amazon-s3-url)](https://www.npmjs.com/package/amazon-s3-url)

# Amazon S3 URL Formatter and Parser
This small and dependency-free library is designed to help you check, format and parse Amazon S3 URLs.
Please note that this library does only rudimentary URL validation on the structure of the URL. It currently does not validate [bucket names](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) and [object keys](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html) against the rules defined in the AWS documentation.

## Amazon S3 URL Formats
Amazon S3 supports a combination of different styles:

### Virtual-hosted-style and Path-style

The difference between these two styles is how the bucket name is included in the URL, either as part of the hostname or as part of the pathname.
- Virtual-hosted-style URLs have the bucket name as part of the host: `<bucket>.s3.amazonaws.com/<key>` 
- Path-style URLs have the bucket name as part of the path, e.g. `s3.amazonaws.com/<bucket>/<key>` 
	
> [!WARNING]
> Path-style URLs will be discontinued in the future See [Amazon S3 backward compatibility](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access) for more information.

### Regional and Legacy

The difference between these two styles is if the region is included in the URL.

- Regional URLs use the regional endpoint `s3.<region>.amazonaws.com`
- Legacy URLs use the global endpoint `s3.amazonaws.com`

> [!WARNING]  
> Only some regions support legacy-style URLs. See [Amazon S3 backward compatibility](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#VirtualHostingBackwardsCompatibility) for more information.

### Protocol S3 and HTTPS

The choice whether to use `s3://` or `https://` depends on the client used to access the S3 bucket.

### Global

The global format `s3://<bucket>/<key>` is the S3 URI that is used by the AWS management console. This format is only available with the `s3://` protocol.

## Installation
```bash
# npm
npm install amazon-s3-url

# yarn
yarn add amazon-s3-url

# pnpm
pnpm add amazon-s3-url
```

## Usage
The library defines the types `S3Object` and `S3UrlFormat` and it exports three functions `formatS3Url`, `parseS3Url` and `isS3Url`. 

### Type `S3Object`
This type represents an S3 object and has the properties `bucket` and `key`. The `region` property is optional and can be used to specify the region of the S3 bucket. 

```ts
type S3Object = {
  bucket: string;
  key: string;
  region?: string;
};

const s3Object: S3Object = {
  bucket: 'bucket',
  key: 'key',
  region: 'us-west-1'
};
```

### Type `S3UrlFormat`
This type represents the format of an S3 URL. 

The format has the structure `<protocol>-<endpoint>-<style>` with the following values:
- Protocol: `s3` or `https`
- Endpoint: `global` or `region` or `legacy`
- Style: `path` or `virtual-host`

```ts
type S3UrlFormat = 
  | "s3-global-path"
  | "s3-legacy-path"
  | "s3-legacy-virtual-host"
  | "https-legacy-path"
  | "https-legacy-virtual-host"
  | "s3-region-path"
  | "s3-region-virtual-host"
  | "https-region-path"
  | "https-region-virtual-host";
```

### ESM and CommonJS
This library is written in TypeScript and is published with ESM and CommonJS support.
That means you can `import` or `require` the library in your project.

```typescript
// ESM
import { formatS3Url } from 'amazon-s3-url';

// CommonJS
const { formatS3Url } = require('amazon-s3-url');
```

### Function `formatS3Url`
This function takes an `s3Object` and an optional `format` and returns a formatted URL string. 
The `format` parameter is optional and defaults to `s3-global-path`. 

Signature:
```ts
function formatS3Url(s3Object: S3Object, format?: S3UrlFormat): string;
```

Example:
```typescript
import { formatS3Url, S3Object } from 'amazon-s3-url';

// s3://bucket/key
const s3Url = formatS3Url(s3Object);

// s3://bucket/key
const s3Url = formatS3Url(s3Object, "s3-global-path");

// s3://s3.amazonaws.com/bucket/key
const s3Url = formatS3Url(s3Object, "s3-legacy-path");

// s3://bucket.s3.amazonaws.com/key
const s3Url = formatS3Url(s3Object, "s3-legacy-virtual-host");

// https://s3.amazonaws.com/bucket/key
const s3Url = formatS3Url(s3Object, "https-legacy-path");

// https://bucket.s3.amazonaws.com/key
const s3Url = formatS3Url(s3Object, "https-legacy-virtual-host");

// s3://s3.us-west-1.amazonaws.com/bucket/key
const s3Url = formatS3Url(s3Object, "s3-region-path");

// s3://bucket.s3.us-west-1.amazonaws.com/key
const s3Url = formatS3Url(s3Object, "s3-region-virtual-host");

// https://s3.us-west-1.amazonaws.com/bucket/key
const s3Url = formatS3Url(s3Object, "https-region-path");

// https://bucket.s3.us-west-1.amazonaws.com/key
const s3Url = formatS3Url(s3Object, "https-region-virtual-host");
```

### Function `parseS3Url`
This function takes an S3 URL string and returns an `S3Object` or throws an error if the URL is invalid.
The `format` parameter is optional and can be used to specify the expected format of the URL. 
If the format is not specified, the function will try to parse the URL in all supported formats.

Signature:
```ts
function parseS3Url(s3Url: string, format?: S3UrlFormat): S3Object;
```

Example:
```typescript
import { parseS3Url } from 'amazon-s3-url';

// s3-global-path
const s3Object = parseS3Url('s3://bucket/key');

// s3-legacy-path
const s3Object = parseS3Url('s3://s3.amazonaws.com/bucket/key');

// s3-legacy-virtual-host
const s3Object = parseS3Url('s3://bucket.s3.amazonaws.com/key');

// https-legacy-path
const s3Object = parseS3Url('https://s3.amazonaws.com/bucket/key');

// https-legacy-virtual-host
const s3Object = parseS3Url('https://bucket.s3.amazonaws.com/key');

// s3-region-path
const s3Object = parseS3Url('s3://s3.us-west-1.amazonaws.com/bucket/key');

// s3-region-virtual-host
const s3Object = parseS3Url('s3://bucket.s3.us-west-1.amazonaws.com/key');

// https-region-path
const s3Object = parseS3Url('https://s3.us-west-1.amazonaws.com/bucket/key');

// https-region-virtual-host
const s3Object = parseS3Url('https://bucket.s3.us-west-1.amazonaws.com/key');
```

### Function `isS3Url`
This function takes a string and returns a boolean indicating whether the string is a valid S3 URL.
The `format` parameter is optional and can be used to specify the expected format of the URL. 
If the format is not specified, the function will try to parse the URL in all supported formats.

Signature:
```ts
function isS3Url(s3Url: string, format?: S3UrlFormat): boolean;
```

Example:
```typescript
import { isS3Url } from 'amazon-s3-url';

// s3-global-path
isS3Url('s3://bucket/key');

// s3-legacy-path
isS3Url('s3://s3.amazonaws.com/bucket/key');

// s3-legacy-virtual-host
isS3Url('s3://bucket.s3.amazonaws.com/key');

// https-legacy-path
isS3Url('https://s3.amazonaws.com/bucket/key');

// https-legacy-virtual-host
isS3Url('https://bucket.s3.amazonaws.com/key');

// s3-region-path
isS3Url('s3://s3.us-west-1.amazonaws.com/bucket/key');

// s3-region-virtual-host
isS3Url('s3://bucket.s3.us-west-1.amazonaws.com/key');

// https-region-path
isS3Url('https://s3.us-west-1.amazonaws.com/bucket/key');

// https-region-virtual-host
isS3Url('https://bucket.s3.us-west-1.amazonaws.com/key');
```

## Caveats
- Some older Amazon S3 regions support endpoints that contain a dash `-` between `s3` and the region, for example `s3‐us-west-2` instead of a dot `s3.us-west-2`. This library supports parsing this format but does not format URLs with this format. See [s3-Region](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#s3-dash-region)

## Limitations
- The bucket name and object key are not validated against the rules defined in the AWS documentation.
- The region is not validated against the list of valid AWS regions.
- The website endpoint is not supported yet.
- The dual-stack, fips, accesspoint and control endpoint are not supported yet.
- Only the the US East (N. Virginia) region supports the legacy path-style URLs `https://s3.amazonaws.com/bucket`. All other regions require the regional path-style syntax. This is not validated by this library.

## Resources
- [Bucket naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html)
- [Object key naming rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-guidelines)
- [Path-style request](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#path-style-access)
- [Virtual-hosted-style request](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#virtual-hosted-style-access)
- [Amazon S3 backward compatibility](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html#VirtualHostingBackwardsCompatibility)
- [Amazon Simple Storage Service endpoints](https://docs.aws.amazon.com/general/latest/gr/s3.html)
