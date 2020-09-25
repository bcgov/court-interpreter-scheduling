terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 2.70"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = var.region
}

locals {
  instance_name   = "${var.project_name}-dev-minishift"
  wildcard_domain = "*.${var.project_name}.${var.dns_zone}"
}
