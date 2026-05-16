module "aws_context" {
  source = "../../modules/aws_context"
}

module "vpc" {
  source = "../../modules/vpc"

  environment  = "prod"
  project_name = var.project_name
}


module "eks" {
  source = "../../modules/eks"

  environment        = "prod"
  project_name       = var.project_name
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
}
