provider "aws" {
  region = "us-east-1"

  alias = "certificates"
}

data "aws_s3_bucket" "website_bucket" {
  bucket = var.bucket_name
}

data "aws_acm_certificate" "acm_certificate" {
  domain   = "*.labali.se"
  provider = aws.certificates
  # id     = "e25c46c8-2b0e-462b-8219-30a95db6a4a0"
}

data "aws_cloudfront_function" "rewrite_for_s3" {
  name  = "rewriteForS3"
  stage = "LIVE"
}

resource "aws_cloudfront_distribution" "cloudfront_website_distribution" {
  origin {
    domain_name              = data.aws_s3_bucket.website_bucket.bucket_domain_name
    origin_path              = "/${var.website_name}"
    origin_access_control_id = var.oac_id
    origin_id                = "s3://labali.se/${var.website_name}"
  }

  aliases = [
    "${var.website_name}.labali.se"
  ]

  default_root_object = "index.html"
  is_ipv6_enabled     = true
  enabled             = true


  default_cache_behavior {
    target_origin_id       = "s3://labali.se/${var.website_name}"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    viewer_protocol_policy = "redirect-to-https"
    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    function_association {
      event_type   = "viewer-request"
      function_arn = data.aws_cloudfront_function.rewrite_for_s3.arn
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  viewer_certificate {
    acm_certificate_arn      = data.aws_acm_certificate.acm_certificate.arn
    ssl_support_method       = "sni-only" # Never change this ! It's the 600$ config
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      locations        = []
      restriction_type = "none"
    }
  }

}
resource "aws_route53_record" "website" {
  zone_id = var.primary_zone_id
  name    = "${var.website_name}.labali.se"
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.cloudfront_website_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.cloudfront_website_distribution.hosted_zone_id
    evaluate_target_health = false
  }

  set_identifier = "${var.website_name}.labali.se"

  latency_routing_policy {
    region = "eu-west-3"
  }
}
