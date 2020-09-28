
resource "aws_key_pair" "minishift" {
  key_name   = local.instance_name
  public_key = var.ssh_public_key
}

resource "aws_security_group" "minishift" {
  name        = "minishift-instance"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.lb.id]
  }

  ingress {
    description = "HTTPS for health check"
    from_port       = 8443
    to_port         = 8443
    protocol        = "tcp"
    security_groups = [aws_security_group.lb.id]
  }

  ingress {
    description     = "SSH"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

// CentOS Linux 7 ca-central-1
// https://wiki.centos.org/Cloud/AWS
resource "aws_instance" "minishift" {
  ami                         = "ami-0252eebc56636a56b"
  instance_type               = "t3a.large"
  key_name                    = aws_key_pair.minishift.key_name
  subnet_id                   = var.subnet_id
  vpc_security_group_ids      = [aws_security_group.minishift.id]
  associate_public_ip_address = true
  // Enables termination protection
  disable_api_termination     = true

  tags = {
    Name = local.instance_name
  }

  root_block_device {
    volume_size = 64
  }
}
