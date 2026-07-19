# Configure AWS provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# RDS MySQL Database
resource "aws_db_instance" "sg_io_db" {
  identifier     = "sg-io-mysql"
  engine         = "mysql"
  engine_version = "8.0.35"
  instance_class = "db.t3.micro"
  
  db_name  = "sg_io"
  username = var.db_username
  password = var.db_password
  
  allocated_storage = 20
  storage_encrypted = true
  
  multi_az            = true
  publicly_accessible = false
  
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "sg-io-final-snapshot"
  
  tags = {
    Name    = "sg-io-database"
    Project = "sg-io"
  }
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "sg_io_redis" {
  cluster_id           = "sg-io-redis"
  engine               = "redis"
  node_type           = "cache.t3.micro"
  num_cache_nodes     = 1
  parameter_group_name = "default.redis7"
  engine_version      = "7.0"
  port                = 6379
  
  tags = {
    Name    = "sg-io-cache"
    Project = "sg-io"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "sg_io" {
  name = "sg-io-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  
  tags = {
    Name    = "sg-io-cluster"
    Project = "sg-io"
  }
}

# ECR Repository
resource "aws_ecr_repository" "sg_io" {
  name                 = "sg-io"
  image_tag_mutability = "MUTABLE"
  
  image_scanning_configuration {
    scan_on_push = true
  }
  
  tags = {
    Name    = "sg-io-repo"
    Project = "sg-io"
  }
}

# Variables
variable "aws_region" {
  default = "us-east-1"
}

variable "db_username" {
  sensitive = true
}

variable "db_password" {
  sensitive = true
}

# Outputs
output "database_endpoint" {
  value       = aws_db_instance.sg_io_db.endpoint
  description = "Database endpoint"
}

output "redis_endpoint" {
  value       = aws_elasticache_cluster.sg_io_redis.cache_nodes[0].address
  description = "Redis endpoint"
}

output "ecr_repository_url" {
  value       = aws_ecr_repository.sg_io.repository_url
  description = "ECR repository URL"
}