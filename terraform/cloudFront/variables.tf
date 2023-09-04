variable "website_name" {
  type        = string
  description = "The name of your website"
}

variable "bucket_name" {
  type        = string
  description = "The bucket's name"
}

variable "primary_zone_id" {
  type        = string
  description = "Primary dns id"
}

variable "oac_id" {
  type        = string
  description = "The oac id"
  default     = "E8GR660Q06XLE"
}
