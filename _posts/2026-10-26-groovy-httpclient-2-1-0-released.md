---
title: groovy-HttpClient 2.1.0 released
date: 2026-10-26 13:30:00 +0000
category: Release
project: groovy-HttpClient
downloads:
  - title: User guide 2.1.0 (PDF)
    file: /downloads/groovy-httpclient/groovy-httpclient-user-guide-2.1.0.pdf
    note: 3 MB, from first request to advanced configuration
description: groovy-HttpClient 2.1.0 is on Maven Central -- Groovy 6, Java 25, HTTP/3, secure defaults, codecs, streaming, auth and published test fixtures.
---

groovy-HttpClient 2.1.0 is now on Maven Central. It is the first public release since 1.0.0 and the biggest
so far: a move to Groovy 6 and Java 25, HTTP/3, a security overhaul, and a set of new features that close
most of the gap with HttpBuilder-NG.

<!--more-->

## Get it

```groovy
dependencies {
    implementation 'io.github.woodmawa:groovy-httpclient:2.1.0'

    // optional: the mock server, test DSL and Spock trait for your own tests
    testImplementation testFixtures('io.github.woodmawa:groovy-httpclient:2.1.0')
}
```

Requires Java 25+ (HTTP/3 needs JDK 26+), Groovy 6.0+ and any SLF4J 2.x binding. Maven coordinates and
the test-fixtures classifier are in the [README](https://github.com/woodmawa/groovy-HttpClient#installation).

```groovy
import org.softwood.http.GroovyHttpClient

def client = new GroovyHttpClient('https://api.example.com')

def response = client.getSync('/users/123')
println response.statusCode
println response.json.name
```

## Platform

- Built with Groovy 6.0.0 and compiled to a Java 25 bytecode floor; tested on JDK 25 and JDK 27.
- **HTTP/3** on JDK 26+ is opt-in: `builder(url).http3()` for a client, or `http3()` on a single request.
  On JDK 25 the client falls back to HTTP/2.

## Secure by default

A line-by-line security review of 1.x produced thirteen findings, all fixed in this release. The ones you
will notice:

- `new GroovyHttpClient(url)` verifies certificates and host names. 1.x accepted any certificate.
- Redirects are followed by the library, with every hop checked against `allowedHosts`, never HTTPS to
  HTTP, and credentials removed when the origin changes.
- `maxResponseBytes` is enforced while the body streams in, not after it has been buffered.
- POST and PATCH are retried only when you opt in with `retryNonIdempotent(true)`.
- Cookie values and multipart headers are checked for header injection.

## New in 2.1

- **Codecs and typed results**: JSON, XML, CSV, form and text built in, optional Jackson, `+json` and
  `+xml` media types, and typed calls such as `getSync(Customer, '/customers/42')`.
- **Response handlers**: `response { success {}; when(404) {}; failure {}; exception {} }` turns outcomes
  into values.
- **Error detail**: `HttpResponseException` carries status, headers, method, URI and body as fields, parses
  RFC 9457 problem details, and keeps the body out of its message so logs stay clean.
- **Streaming**: downloads to a file or stream, uploads from a file, stream or publisher, and line,
  Server-Sent Event and NDJSON consumers.
- **Compression**: opt-in gzip/deflate, with the size limit counting decompressed bytes.
- **Authentication and proxies**: basic, bearer, API key and OAuth2 client credentials; an explicit HTTP
  proxy with authentication. SOCKS is refused rather than silently bypassed.
- **Observability**: per-client metrics and circuit breaker inspection.
- **Published test fixtures** (incubating): `MockHttpServer`, `HttpClientTestDsl` and `HttpClientTestTrait`.

## Upgrading from 1.x

The secure defaults above are deliberate behaviour changes, alongside a few others: `*Sync` methods throw
the real exception rather than `ExecutionException`, interceptors receive 4xx and 5xx as responses, and
there is no bundled logging backend. The user guide's *Upgrading* chapter lists every change with who
will notice it and what to do. 2.0.0 was never published, so read both its "1.x to 2.0" and "2.0 to 2.1"
sections.

## Documentation

- [User guide (PDF)]({{ '/downloads/groovy-httpclient/groovy-httpclient-user-guide-2.1.0.pdf' | relative_url }}) --
  rewritten for 2.1, from first request to advanced configuration
- [README](https://github.com/woodmawa/groovy-HttpClient#readme) -- installation and a tour of every feature
- [SSL certificate guide](https://github.com/woodmawa/groovy-HttpClient/blob/master/SSL_CERTIFICATE_GUIDE.md) --
  trust stores, mutual TLS and corporate proxies

Bug reports and feature requests are welcome on
[GitHub issues](https://github.com/woodmawa/groovy-HttpClient/issues).
