
data "aws_route53_zone" "main" {
  name         = var.dns_zone
  private_zone = false
}

resource "aws_route53_record" "wildcard" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = local.wildcard_domain
  type    = "A"
  
  alias {
    name                   = aws_lb.main.dns_name
    zone_id                = aws_lb.main.zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "ssh" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = local.ssh_domain
  type    = "A"
  ttl     = 300
  records = [aws_instance.minishift.public_ip]
}
