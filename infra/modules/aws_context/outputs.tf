output "account_id" {
  description = "Current AWS account ID."
  value       = data.aws_caller_identity.current.account_id
}

output "region" {
  description = "Current AWS region name."
  value       = data.aws_region.current.region
}
