variable "region" {
    default = "ca-central-1"
}

variable "vpc_id" {
    default = "vpc-06919e145a8827902"
}

variable "subnet_id" {
    default = "subnet-07ab10543769589e0"
}

variable "subnet2_id" {
    default = "subnet-0b85bd21b21785eb6"
}

variable "project_name" {
    default = "court-scheduler"
}

variable "ssh_public_key" {
    default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDmej0qTh4cLSFZqcaRez6bGAERLldDtnxwgr0HhtBfIx6mK7MCymGKABrw/u21qtlD1winHESX+BifYHVCzMgG0L8oYbRJDyMMcPpDXwPw4rUn13yGGeWK1JvF6Haa3ZNm0+1ZuHkf1VvNwUnJQrQfz/5845lmiY1TjSxw4nqtl2KlkH5PEz3AYQqiZUNZdhgR4TRO+N537ywHuLHszT+aSXonkBY1vrA4qWSaTksD60PVkmAi8AyE1vfOeB9JduAi+FKyHdUoc3Q2uLI1FIZscuNl76VqcUViiJ+eszabkhhLxBpZnPgU9/a4zy4SAolsMGBPs2UuyBLmPAIL4+WE+yjwdQfnOiXKgwmbrCYnqHOxRM3m0/0yVkjVUDma1tApOOoCDz1R63CFSyWrZikfsuGheNdayQAAWeDDd+8OLRb2HM52wHUvoVFfbF8AoALa/l5otOjPTBhkWWvS/pCErwDJn8tQArHXpU/jyO8E3bmOqaAneHTPKvjRelnwqf8="
}

variable "dns_zone" {
    default = "freshworks.club."
}
