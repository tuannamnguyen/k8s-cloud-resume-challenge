output "aws_account_id" {
  description = "AWS account ID used by this environment."
  value       = module.aws_context.account_id
}

output "aws_region" {
  description = "AWS region used by this environment."
  value       = module.aws_context.region
}
