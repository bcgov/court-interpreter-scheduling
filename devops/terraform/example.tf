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

resource "aws_key_pair" "main" {
  key_name   = "courtsh-dev"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDRDuQGMBbPxLcVs1jCFiIc9pAy8AuGXYwRzGxxH/NV5mMqyqbQblzYBI4AypJYveXR65O4lMGQ8BQJdYMOv4ZFtdIuiBjF3CCd3ALx2XRgk7im06V07ZlmS34I1OR32XSdeYV0wxX+jBSD7MW5lp7t4SKkXjxra7bX30Nlzrr1+vYwOsQs3gkIaMJjmY35lIKDxkngfLS+l/+Hx0uXiTJNaFBMbk4ZoTHqwUbBi2rY+omJpDsNFAzZ9piPGWzQlYv2a1V1aclgslGKwGCT5okZ1690e7cjhcwQ84VIzCx/AUIgizEoiE2IIrugc/1aPLYIfiHBnk2hH7FUV/qpK4dsGe9Hf1PIVQu/Rhd0e3IprYYUYb0vxWYo4ugr8DpqmXS6+OvVDyXnvlUMxYcx04iXprwr/vZLlYpzCnfuRZPAbGpfqZsT4811Vkon1EFZoUzXTBkSj7WVJoU6Dn1q38dHzJ0Sg9gfqfGU/rhqTyrOAn4JPsriIy3O8Njs/XhRuFk="
}

resource "aws_security_group" "minishift" {
  name        = "Minishift"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from VPC"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

// CentOS Linux 8 8.2.2004 ca-central-1 ami-07a182edcd7d04084 x86_64
// https://wiki.centos.org/Cloud/AWS
resource "aws_instance" "minishift" {
  ami      = "ami-07a182edcd7d04084"
  instance_type = "t3a.large"
  key_name = aws_key_pair.main.key_name
  subnet_id = var.subnet_id
  vpc_security_group_ids = [aws_security_group.minishift.id]
  associate_public_ip_address = true
}

