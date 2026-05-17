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

variable "k8s_cluster_version" {
  description = "K8s version for the EKS cluster"
  type        = string
  default     = "1.35"
}
