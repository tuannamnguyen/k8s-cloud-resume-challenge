module "eks" {
  source = "terraform-aws-modules/eks/aws"

  name               = "${var.project_name}-${var.environment}"
  kubernetes_version = "1.33"

  compute_config = {
    enabled    = true
    node_pools = ["general-purpose"]
  }

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnet_ids
}
