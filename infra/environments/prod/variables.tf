variable "aws_region" {
  description = "AWS region for this environment."
  type        = string
  default     = "ap-southeast-1"
}

variable "aws_profile" {
  description = "Local AWS CLI profile used by Terraform."
  type        = string
  default     = "admin-access"
}
