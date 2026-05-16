# Terraform Infrastructure

This folder is organized so environment-specific configuration stays separate
from reusable Terraform modules.

## Layout

```text
infra/
  environments/
    prod/                 # Deployable Terraform root module
      backend.tf          # Remote state configuration
      main.tf             # Environment composition
      outputs.tf          # Environment outputs
      providers.tf        # Provider configuration
      variables.tf        # Environment inputs
      versions.tf         # Terraform/provider constraints
  modules/
    aws_context/          # Example reusable module
      data.tf
      outputs.tf
```

Add shared infrastructure in `modules/<module_name>` and compose it from
`environments/<env>/main.tf`. Keep backend configuration and concrete values in
the environment folders.

## Usage

From an environment folder:

```bash
cd infra/environments/prod
terraform init
terraform plan
terraform apply
```

The `prod` environment currently preserves the original AWS provider and S3
backend settings.
