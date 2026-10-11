variable "region" {
  type    = string
  default = "eu-central-1"
}

variable "project" {
  type    = string
  default = "lab1"
}

variable "db_username" {
  type    = string
  default = "root"
}

variable "db_password" {
  type      = string
  sensitive = true
}
