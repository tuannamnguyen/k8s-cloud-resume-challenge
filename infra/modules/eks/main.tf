module "eks" {
  source = "terraform-aws-modules/eks/aws"

  name               = "${var.project_name}-${var.environment}"
  kubernetes_version = var.k8s_cluster_version

  compute_config = {
    enabled    = true
    node_pools = ["general-purpose"]
  }

  endpoint_public_access  = true
  endpoint_private_access = false

  vpc_id     = var.vpc_id
  subnet_ids = var.private_subnet_ids
}
