terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.10.0"
    }
  }
}

provider "aws" {
  region = "eu-west-3"

  default_tags {
    tags = {
      product = "new website generator"
      version = var.script_version
    }
  }
}

data "aws_s3_bucket" "labalise_bucket" {
  bucket = "labali.se"
}

resource "aws_s3_object" "website_folder" {
  key          = "${var.website_name}/"
  bucket       = data.aws_s3_bucket.labalise_bucket.id
  content_type = "folder"
}

data "aws_iam_role" "site_creator_role" {
  name = "labaliseRole"
}

data "aws_route53_zone" "labalise_main_zone" {
  name = "labali.se"
}

module "codebuild" {
  source       = "./makeCodebuild"
  iam_role_arn = data.aws_iam_role.site_creator_role.arn
  website_name = var.website_name
}


module "cloudFront" {
  source       = "./cloudFront"
  website_name = var.website_name
  bucket_name  = aws_s3_object.website_folder.bucket
  primary_zone_id = data.aws_route53_zone.labalise_main_zone.zone_id
}
