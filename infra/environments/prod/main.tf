module "aws_context" {
  source = "../../modules/aws_context"
}

module "vpc" {
  source = "../../modules/vpc"

  environment  = "prod"
  project_name = var.project_name
}
