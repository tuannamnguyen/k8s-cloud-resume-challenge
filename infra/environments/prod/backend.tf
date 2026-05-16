terraform {
  backend "s3" {
    bucket  = "tf-state-533267191229"
    key     = "tf-state"
    region  = "ap-southeast-1"
    profile = "admin-access"
  }
}
