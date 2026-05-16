variable "environment" {
  type = string
}

variable "project_name" {
  type = string
}

variable "vpc_id" {
  description = "ID of the VPC where EKS will be deployed."
  type        = string
}

variable "private_subnet_ids" {
  description = "List of IDs of private subnets"
  type        = list(string)
}
