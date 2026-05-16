# Terraform Modules

Reusable infrastructure belongs here. Each module should expose variables and
outputs, avoid hard-coded environment values, and be consumed from
`infra/environments/<env>/main.tf`.

## How to Develop Modules

Create one folder per reusable infrastructure concern:

```text
infra/modules/
  s3_website/
    main.tf
    variables.tf
    outputs.tf
```

Use these files consistently:

- `main.tf`: resources and data sources owned by the module.
- `variables.tf`: input values the environment must provide.
- `outputs.tf`: values the environment or other modules may need.

Do not put backend configuration, provider profiles, or concrete environment
names in modules. Those belong in `infra/environments/<env>`.

## Example Module

```hcl
variable "bucket_name" {
  description = "Name of the S3 bucket."
  type        = string
}

resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name
}

output "bucket_id" {
  description = "Created S3 bucket ID."
  value       = aws_s3_bucket.this.id
}
```

Consume it from an environment root module:

```hcl
module "website_bucket" {
  source = "../../modules/s3_website"

  bucket_name = "resume-site-prod"
}
```

## Development Workflow

Run Terraform from an environment folder, not from this `modules` folder:

```bash
cd infra/environments/prod
terraform init
terraform fmt -recursive
terraform validate
terraform plan
```

When adding or changing a module:

1. Add or update the module under `infra/modules/<module_name>`.
2. Wire it into `infra/environments/<env>/main.tf`.
3. Pass environment-specific values through variables.
4. Expose only useful values through outputs.
5. Run `terraform fmt`, `terraform validate`, and `terraform plan` from the
   environment folder.

## Module Design Rules

- Keep modules focused. A module should own one clear responsibility, such as a
  website bucket, DNS record set, certificate, or compute service.
- Prefer variables over hard-coded names, regions, ARNs, account IDs, and tags.
- Use outputs for stable integration points, not every internal resource field.
- Avoid reaching across module boundaries with direct resource references.
- Keep secrets out of modules and out of committed `.tfvars` files.
- Add required variables with descriptions so callers know what to provide.
